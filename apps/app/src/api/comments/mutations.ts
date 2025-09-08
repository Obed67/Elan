import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { ApiError, ensureLoggedIn, handleApiError } from "@/lib/utils/server-utils"
import { apiInputFromSchema } from "@/types"

import {
  createCommentResponseSchema,
  createCommentSchema,
  deleteCommentResponseSchema,
  deleteCommentSchema,
  updateCommentResponseSchema,
  updateCommentSchema,
} from "./schemas"

// ===== CREATE COMMENT =====

export const createComment = async ({ input, ctx: { session } }: apiInputFromSchema<typeof createCommentSchema>) => {
  ensureLoggedIn(session)
  try {
    const { taskId, content } = input

    // Vérifier que l'utilisateur a accès à la tâche
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          OR: [
            { ownerId: session.user.id },
            {
              members: {
                some: {
                  userId: session.user.id,
                },
              },
            },
          ],
        },
      },
    })

    if (!existingTask) {
      return ApiError("unknownError") // "taskNotFound"
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        taskId,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
            profilePicture: {
              select: {
                key: true,
              },
            },
          },
        },
      },
    })

    // Créer des notifications pour les personnes concernées
    let notificationsSent = 0

    // Créer une notification pour le créateur de la tâche (si différent de l'auteur du commentaire)
    if (existingTask.creatorId !== session.user.id) {
      await prisma.notification.create({
        data: {
          type: "TASK_COMMENTED",
          title: "Nouveau commentaire",
          message: `Un nouveau commentaire a été ajouté à la tâche "${existingTask.title}"`,
          userId: existingTask.creatorId,
          taskId: taskId,
          projectId: existingTask.projectId,
        },
      })
      notificationsSent++
    }

    // Créer une notification pour l'assigné de la tâche (si différent de l'auteur du commentaire)
    if (
      existingTask.assigneeId &&
      existingTask.assigneeId !== session.user.id &&
      existingTask.assigneeId !== existingTask.creatorId
    ) {
      await prisma.notification.create({
        data: {
          type: "TASK_COMMENTED",
          title: "Nouveau commentaire",
          message: `Un nouveau commentaire a été ajouté à la tâche "${existingTask.title}"`,
          userId: existingTask.assigneeId,
          taskId: taskId,
          projectId: existingTask.projectId,
        },
      })
      notificationsSent++
    }

    const data: z.infer<ReturnType<typeof createCommentResponseSchema>> = { notificationsSent, comment }
    return data
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

// ===== UPDATE COMMENT =====

export const updateComment = async ({ input, ctx: { session } }: apiInputFromSchema<typeof updateCommentSchema>) => {
  ensureLoggedIn(session)
  try {
    const { id, content } = input

    // Vérifier que le commentaire existe et que l'utilisateur est l'auteur
    const existingComment = await prisma.comment.findFirst({
      where: {
        id,
        authorId: session.user.id,
      },
      include: {
        task: {
          include: {
            project: {
              include: {
                members: true,
              },
            },
          },
        },
      },
    })

    if (!existingComment) {
      return ApiError("unknownError") // "commentNotFound"
    }

    // Vérifier que l'utilisateur a encore accès au projet
    const hasAccess =
      existingComment.task.project.ownerId === session.user.id ||
      existingComment.task.project.members.some((member) => member.userId === session.user.id)

    if (!hasAccess) {
      return ApiError("unknownError") // "unauthorizedCommentAccess"
    }

    const comment = await prisma.comment.update({
      where: { id },
      data: { content },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
            profilePicture: {
              select: {
                key: true,
              },
            },
          },
        },
      },
    })

    const data: z.infer<ReturnType<typeof updateCommentResponseSchema>> = { comment }
    return data
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

// ===== DELETE COMMENT =====

export const deleteComment = async ({ input, ctx: { session } }: apiInputFromSchema<typeof deleteCommentSchema>) => {
  ensureLoggedIn(session)
  try {
    const { id } = input

    // Vérifier que le commentaire existe
    const existingComment = await prisma.comment.findFirst({
      where: { id },
      include: {
        task: {
          include: {
            project: {
              include: {
                members: true,
              },
            },
          },
        },
      },
    })

    if (!existingComment) {
      return ApiError("unknownError") // "commentNotFound"
    }

    // Vérifier que l'utilisateur peut supprimer le commentaire
    // (auteur du commentaire ou propriétaire/admin du projet)
    const isAuthor = existingComment.authorId === session.user.id
    const isProjectOwner = existingComment.task.project.ownerId === session.user.id
    const isProjectAdmin = existingComment.task.project.members.some(
      (member) => member.userId === session.user.id && member.role === "ADMIN"
    )

    if (!isAuthor && !isProjectOwner && !isProjectAdmin) {
      return ApiError("unknownError") // "unauthorizedCommentAccess"
    }

    await prisma.comment.delete({
      where: { id },
    })

    const data: z.infer<ReturnType<typeof deleteCommentResponseSchema>> = { success: true }
    return data
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { handleApiError, ApiError, ensureLoggedIn } from "@/lib/utils/server-utils"
import { apiInputFromSchema } from "@/types"
import { getCommentSchema, listCommentsSchema, getCommentResponseSchema, listCommentsResponseSchema } from "./schemas"

// ===== GET COMMENT =====

export const getComment = async ({ input, ctx: { session } }: apiInputFromSchema<typeof getCommentSchema>) => {
  ensureLoggedIn(session)
  try {
    const { id } = input

    const comment = await prisma.comment.findFirst({
      where: { id },
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

    if (!comment) {
      return ApiError("unknownError") // "commentNotFound"
    }

    // Vérifier que l'utilisateur a accès au projet
    const hasAccess =
      comment.task.project.ownerId === session.user.id ||
      comment.task.project.members.some((member) => member.userId === session.user.id)

    if (!hasAccess) {
      return ApiError("unknownError") // "unauthorizedCommentAccess"
    }

    const data: z.infer<ReturnType<typeof getCommentResponseSchema>> = { comment }
    return data
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

// ===== LIST COMMENTS =====

export const listComments = async ({ input, ctx: { session } }: apiInputFromSchema<typeof listCommentsSchema>) => {
  ensureLoggedIn(session)
  try {
    const { taskId, page, perPage } = input

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

    const skip = (page - 1) * perPage

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { taskId },
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
        orderBy: { createdAt: "asc" },
        skip,
        take: perPage,
      }),
      prisma.comment.count({
        where: { taskId },
      }),
    ])

    const totalPages = Math.ceil(total / perPage)

    const data: z.infer<ReturnType<typeof listCommentsResponseSchema>> = {
      comments,
      pagination: {
        page,
        perPage,
        total,
        totalPages,
      },
    }
    return data
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

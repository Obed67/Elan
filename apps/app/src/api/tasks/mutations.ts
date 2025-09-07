import { z } from "zod"

import {
  assignTaskResponseSchema,
  assignTaskSchema,
  createTaskResponseSchema,
  createTaskSchema,
  deleteTaskResponseSchema,
  deleteTaskSchema,
  updateTaskResponseSchema,
  updateTaskSchema,
} from "@/api/tasks/schemas"
import { prisma } from "@/lib/prisma"
import { ApiError, ensureLoggedIn, handleApiError } from "@/lib/utils/server-utils"
import { apiInputFromSchema } from "@/types"
import { logger } from "@elan/lib"
import { Prisma } from "@prisma/client"

// ===== CREATE TASK =====

export const createTask = async ({ input, ctx: { session } }: apiInputFromSchema<typeof createTaskSchema>) => {
  ensureLoggedIn(session)
  try {
    const { projectId, title, description, status, priority, dueDate, assigneeId } = input

    // Vérifier que l'utilisateur a accès au projet
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
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
    })

    if (!project) {
      return ApiError("unknownError") // "projectNotFound"
    }

    // Vérifier que l'assignee est membre du projet si spécifié
    if (assigneeId) {
      const isMember = await prisma.projectMember.findFirst({
        where: {
          projectId,
          userId: assigneeId,
        },
      })

      if (!isMember) {
        return ApiError("unknownError") // "userNotMember"
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        dueDate,
        projectId,
        assigneeId,
        creatorId: session.user.id,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
            profilePicture: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
          },
        },
        _count: {
          select: {
            comments: true,
            attachments: true,
          },
        },
      },
    })

    const data: z.infer<ReturnType<typeof createTaskResponseSchema>> = { task }
    return data
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

// ===== UPDATE TASK =====

export const updateTask = async ({ input, ctx: { session } }: apiInputFromSchema<typeof updateTaskSchema>) => {
  ensureLoggedIn(session)
  try {
    const { id, title, description, status, priority, dueDate, assigneeId } = input

    // Vérifier que l'utilisateur a accès à la tâche
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
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
      include: {
        project: true,
      },
    })

    if (!existingTask) {
      return ApiError("unknownError") // "taskNotFound"
    }

    // Vérifier que l'assignee est membre du projet si spécifié
    if (assigneeId) {
      const isMember = await prisma.projectMember.findFirst({
        where: {
          projectId: existingTask.projectId,
          userId: assigneeId,
        },
      })

      if (!isMember) {
        return ApiError("unknownError") // "userNotMember"
      }
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(dueDate !== undefined && { dueDate }),
        ...(assigneeId !== undefined && { assigneeId }),
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
            profilePicture: true,
          },
        },
      },
    })

    const data: z.infer<ReturnType<typeof updateTaskResponseSchema>> = { task }
    return data
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

// ===== DELETE TASK =====

export const deleteTask = async ({ input, ctx: { session } }: apiInputFromSchema<typeof deleteTaskSchema>) => {
  ensureLoggedIn(session)
  try {
    const { id } = input

    // Vérifier que l'utilisateur a accès à la tâche
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
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

    await prisma.task.delete({
      where: { id },
    })

    const data: z.infer<ReturnType<typeof deleteTaskResponseSchema>> = { success: true }
    return data
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

// ===== ASSIGN TASK =====

export const assignTask = async ({ input, ctx: { session } }: apiInputFromSchema<typeof assignTaskSchema>) => {
  ensureLoggedIn(session)
  try {
    const { taskId, assigneeId } = input

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
      include: {
        project: true,
      },
    })

    if (!existingTask) {
      return ApiError("unknownError") // "taskNotFound"
    }

    // Vérifier que l'assignee est membre du projet si spécifié
    if (assigneeId) {
      const isMember = await prisma.projectMember.findFirst({
        where: {
          projectId: existingTask.projectId,
          userId: assigneeId,
        },
      })

      if (!isMember) {
        return ApiError("userNotMember")
      }
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        assigneeId,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
            profilePicture: true,
          },
        },
      },
    })

    const data: z.infer<ReturnType<typeof assignTaskResponseSchema>> = { success: true, task }
    return data
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

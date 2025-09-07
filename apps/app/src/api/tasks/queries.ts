import { z } from "zod"

import { getTaskResponseSchema, getTaskSchema, listTasksResponseSchema, listTasksSchema } from "@/api/tasks/schemas"
import { prisma } from "@/lib/prisma"
import { ApiError, ensureLoggedIn, handleApiError } from "@/lib/utils/server-utils"
import { apiInputFromSchema } from "@/types"
import { logger } from "@elan/lib"
import { Prisma } from "@prisma/client"

// ===== GET TASK =====

export const getTask = async ({ input, ctx: { session } }: apiInputFromSchema<typeof getTaskSchema>) => {
  ensureLoggedIn(session)
  try {
    const { id } = input

    const task = await prisma.task.findFirst({
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
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                username: true,
                profilePicture: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        attachments: {
          include: {
            file: true,
          },
          orderBy: {
            createdAt: "asc",
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

    if (!task) {
      return ApiError("unknownError") // "taskNotFound"
    }

    const data: z.infer<ReturnType<typeof getTaskResponseSchema>> = { task }
    return data
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

// ===== LIST TASKS =====

export const listTasks = async ({ input, ctx: { session } }: apiInputFromSchema<typeof listTasksSchema>) => {
  ensureLoggedIn(session)
  try {
    const { projectId, page, perPage, status, priority, assigneeId, search } = input

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

    // Construire les filtres
    const where: Prisma.TaskWhereInput = {
      projectId,
      ...(status && { status }),
      ...(priority && { priority }),
      ...(assigneeId && { assigneeId }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),
    }

    // Compter le total
    const total = await prisma.task.count({ where })

    // Récupérer les tâches
    const tasks = await prisma.task.findMany({
      where,
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
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * perPage,
      take: perPage,
    })

    const totalPages = Math.ceil(total / perPage)

    const data: z.infer<ReturnType<typeof listTasksResponseSchema>> = {
      tasks,
      meta: {
        total,
        page,
        perPage,
        totalPages,
      },
    }
    return data
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

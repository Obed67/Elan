import { z } from "zod"

import {
  getProjectResponseSchema,
  getProjectSchema,
  listProjectsResponseSchema,
  listProjectsSchema,
} from "@/api/projects/schemas"
import { prisma } from "@/lib/prisma"
import { ApiError, ensureLoggedIn, handleApiError } from "@/lib/utils/server-utils"
import { apiInputFromSchema } from "@/types"

// ===== GET PROJECT =====

export const getProject = async ({ input, ctx: { session } }: apiInputFromSchema<typeof getProjectSchema>) => {
  ensureLoggedIn(session)
  try {
    const { id } = input

    const project = await prisma.project.findFirst({
      where: {
        id,
        OR: [
          { ownerId: session.user.id },
          { isPublic: true },
          {
            members: {
              some: {
                userId: session.user.id,
              },
            },
          },
        ],
      },
      include: {
        owner: {
          include: {
            profilePicture: true,
          },
        },
        members: {
          include: {
            user: {
              include: {
                profilePicture: true,
              },
            },
          },
        },
        tasks: {
          include: {
            assignee: {
              include: {
                profilePicture: true,
              },
            },
            creator: true,
            _count: {
              select: {
                comments: true,
                attachments: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            tasks: true,
            members: true,
          },
        },
      },
    })

    if (!project) {
      return ApiError("unknownError", "NOT_FOUND")
    }

    const data: z.infer<ReturnType<typeof getProjectResponseSchema>> = { project }
    return data
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

// ===== LIST PROJECTS =====

export const listProjects = async ({ input, ctx: { session } }: apiInputFromSchema<typeof listProjectsSchema>) => {
  ensureLoggedIn(session)
  try {
    const { page, perPage, search, isPublic } = input

    const skip = (page - 1) * perPage

    // Construire les conditions de filtrage
    const whereConditions: any = {
      OR: [
        { ownerId: session.user.id },
        { isPublic: true },
        {
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
      ],
    }

    // Ajouter le filtre de recherche
    if (search) {
      whereConditions.AND = [
        {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        },
      ]
    }

    // Ajouter le filtre de visibilité
    if (isPublic !== undefined) {
      whereConditions.isPublic = isPublic
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where: whereConditions,
        include: {
          owner: {
            include: {
              profilePicture: true,
            },
          },
          _count: {
            select: {
              tasks: true,
              members: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
        skip,
        take: perPage,
      }),
      prisma.project.count({
        where: whereConditions,
      }),
    ])

    const totalPages = Math.ceil(total / perPage)

    const data: z.infer<ReturnType<typeof listProjectsResponseSchema>> = {
      projects,
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

import { z } from "zod"

import {
  createProjectResponseSchema,
  createProjectSchema,
  deleteProjectResponseSchema,
  deleteProjectSchema,
  inviteUserResponseSchema,
  inviteUserSchema,
  removeMemberResponseSchema,
  removeMemberSchema,
  updateMemberRoleResponseSchema,
  updateMemberRoleSchema,
  updateProjectResponseSchema,
  updateProjectSchema,
} from "@/api/projects/schemas"
import { prisma } from "@/lib/prisma"
import { ApiError, ensureLoggedIn, handleApiError } from "@/lib/utils/server-utils"
import { apiInputFromSchema } from "@/types"
import { logger } from "@elan/lib"
import { Prisma } from "@prisma/client"

// ===== CREATE PROJECT =====

export const createProject = async ({ input, ctx: { session } }: apiInputFromSchema<typeof createProjectSchema>) => {
  ensureLoggedIn(session)
  try {
    const { name, description, color, isPublic } = input

    const project = await prisma.project.create({
      data: {
        name,
        description,
        color,
        isPublic,
        ownerId: session.user.id,
      },
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
    })

    const data: z.infer<ReturnType<typeof createProjectResponseSchema>> = { project }
    return data
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return ApiError("unknownError")
      }
    }
    return handleApiError(error)
  }
}

// ===== UPDATE PROJECT =====

export const updateProject = async ({ input, ctx: { session } }: apiInputFromSchema<typeof updateProjectSchema>) => {
  ensureLoggedIn(session)
  try {
    const { id, name, description, color, isPublic } = input

    // Vérifier que l'utilisateur est le propriétaire du projet
    const existingProject = await prisma.project.findFirst({
      where: {
        id,
        ownerId: session.user.id,
      },
    })

    if (!existingProject) {
      return ApiError("unknownError", "NOT_FOUND")
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(color !== undefined && { color }),
        ...(isPublic !== undefined && { isPublic }),
      },
    })

    const data: z.infer<ReturnType<typeof updateProjectResponseSchema>> = { project }
    return data
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return ApiError("unknownError")
      }
    }
    return handleApiError(error)
  }
}

// ===== DELETE PROJECT =====

export const deleteProject = async ({ input, ctx: { session } }: apiInputFromSchema<typeof deleteProjectSchema>) => {
  ensureLoggedIn(session)
  try {
    const { id } = input

    // Vérifier que l'utilisateur est le propriétaire du projet
    const existingProject = await prisma.project.findFirst({
      where: {
        id,
        ownerId: session.user.id,
      },
    })

    if (!existingProject) {
      return ApiError("unknownError", "NOT_FOUND")
    }

    await prisma.project.delete({
      where: { id },
    })

    const data: z.infer<ReturnType<typeof deleteProjectResponseSchema>> = { success: true }
    return data
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

// ===== INVITE USER =====

export const inviteUser = async ({ input, ctx: { session } }: apiInputFromSchema<typeof inviteUserSchema>) => {
  ensureLoggedIn(session)
  try {
    const { projectId, email, role } = input

    // Vérifier que l'utilisateur est le propriétaire ou admin du projet
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { ownerId: session.user.id },
          {
            members: {
              some: {
                userId: session.user.id,
                role: { in: ["OWNER", "ADMIN"] },
              },
            },
          },
        ],
      },
    })

    if (!project) {
      return ApiError("unknownError", "NOT_FOUND")
    }

    // Trouver l'utilisateur à inviter
    const userToInvite = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        profilePicture: true,
      },
    })

    if (!userToInvite) {
      return ApiError("userNotFound", "NOT_FOUND")
    }

    // Vérifier si l'utilisateur est déjà membre
    const existingMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: userToInvite.id,
        },
      },
    })

    if (existingMember) {
      return ApiError("unknownError")
    }

    // Créer l'invitation
    const member = await prisma.projectMember.create({
      data: {
        projectId,
        userId: userToInvite.id,
        role,
      },
      include: {
        user: {
          include: {
            profilePicture: true,
          },
        },
      },
    })

    // TODO: Envoyer une notification à l'utilisateur invité
    logger.info(`User ${userToInvite.email} invited to project ${project.name}`)

    const data: z.infer<ReturnType<typeof inviteUserResponseSchema>> = { success: true, member }
    return data
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

// ===== REMOVE MEMBER =====

export const removeMember = async ({ input, ctx: { session } }: apiInputFromSchema<typeof removeMemberSchema>) => {
  ensureLoggedIn(session)
  try {
    const { projectId, userId } = input

    // Vérifier que l'utilisateur est le propriétaire ou admin du projet
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { ownerId: session.user.id },
          {
            members: {
              some: {
                userId: session.user.id,
                role: { in: ["OWNER", "ADMIN"] },
              },
            },
          },
        ],
      },
    })

    if (!project) {
      return ApiError("unknownError", "NOT_FOUND")
    }

    // Vérifier que l'utilisateur à supprimer n'est pas le propriétaire
    if (project.ownerId === userId) {
      return ApiError("unknownError")
    }

    // Vérifier que l'utilisateur à supprimer est membre
    const memberToRemove = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    })

    if (!memberToRemove) {
      return ApiError("unknownError")
    }

    await prisma.projectMember.delete({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    })

    // TODO: Envoyer une notification à l'utilisateur supprimé
    logger.info(`User ${userId} removed from project ${project.name}`)

    const data: z.infer<ReturnType<typeof removeMemberResponseSchema>> = { success: true }
    return data
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

// ===== UPDATE MEMBER ROLE =====

export const updateMemberRole = async ({
  input,
  ctx: { session },
}: apiInputFromSchema<typeof updateMemberRoleSchema>) => {
  ensureLoggedIn(session)
  try {
    const { projectId, userId, role } = input

    // Vérifier que l'utilisateur est le propriétaire du projet
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: session.user.id,
      },
    })

    if (!project) {
      return ApiError("unknownError", "NOT_FOUND")
    }

    // Vérifier que l'utilisateur à modifier n'est pas le propriétaire
    if (project.ownerId === userId) {
      return ApiError("unknownError")
    }

    // Vérifier que l'utilisateur à modifier est membre
    const memberToUpdate = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    })

    if (!memberToUpdate) {
      return ApiError("unknownError")
    }

    const member = await prisma.projectMember.update({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
      data: {
        role,
      },
    })

    // TODO: Envoyer une notification à l'utilisateur
    logger.info(`User ${userId} role updated to ${role} in project ${project.name}`)

    const data: z.infer<ReturnType<typeof updateMemberRoleResponseSchema>> = { success: true, member }
    return data
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

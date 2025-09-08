import { z } from "zod"

import { TDictionary } from "@/lib/langs"
import { dictionaryRequirements } from "@/lib/utils/dictionary"

// ===== PROJECT SCHEMAS =====

export const projectNameSchemaDr = dictionaryRequirements({
  errors: {
    projectName: {
      required: true,
      min3: true,
      max50: true,
    },
  },
})

export const projectNameSchema = (dictionary?: TDictionary<typeof projectNameSchemaDr>) =>
  z
    .string({
      required_error: dictionary && dictionary.errors.projectName.required,
    })
    .min(3, dictionary && dictionary.errors.projectName.min3)
    .max(50, dictionary && dictionary.errors.projectName.max50)

export const projectDescriptionSchemaDr = dictionaryRequirements({
  errors: {
    projectDescription: {
      max500: true,
    },
  },
})

export const projectDescriptionSchema = (dictionary?: TDictionary<typeof projectDescriptionSchemaDr>) =>
  z
    .string()
    .max(500, dictionary && dictionary.errors.projectDescription.max500)
    .optional()

export const projectColorSchema = () =>
  z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid color format")
    .default("#3B82F6")

// ===== CREATE PROJECT =====

export const createProjectSchemaDr = dictionaryRequirements(projectNameSchemaDr, projectDescriptionSchemaDr)
export const createProjectSchema = (dictionary?: TDictionary<typeof createProjectSchemaDr>) =>
  z.object({
    name: projectNameSchema(dictionary),
    description: projectDescriptionSchema(dictionary),
    color: projectColorSchema(),
    isPublic: z.boolean().default(false),
  })

export const createProjectResponseSchema = () =>
  z.object({
    project: z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().nullable(),
      color: z.string(),
      isPublic: z.boolean(),
      ownerId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
      owner: z.object({
        id: z.string(),
        name: z.string().nullable(),
        email: z.string().nullable(),
        username: z.string().nullable(),
        profilePicture: z
          .object({
            id: z.string(),
            key: z.string(),
            filetype: z.string(),
            bucket: z.string(),
            endpoint: z.string(),
          })
          .nullable(),
      }),
      _count: z.object({
        tasks: z.number(),
        members: z.number(),
      }),
    }),
  })

// ===== UPDATE PROJECT =====

export const updateProjectSchemaDr = dictionaryRequirements(projectNameSchemaDr, projectDescriptionSchemaDr)
export const updateProjectSchema = (dictionary?: TDictionary<typeof updateProjectSchemaDr>) =>
  z.object({
    id: z.string(),
    name: projectNameSchema(dictionary).optional(),
    description: projectDescriptionSchema(dictionary).optional(),
    color: projectColorSchema().optional(),
    isPublic: z.boolean().optional(),
  })

export const updateProjectResponseSchema = () =>
  z.object({
    notificationsSent: z.number(),
    project: z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().nullable(),
      color: z.string(),
      isPublic: z.boolean(),
      ownerId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
  })

// ===== GET PROJECT =====

export const getProjectSchema = () =>
  z.object({
    id: z.string(),
  })

export const getProjectResponseSchema = () =>
  z.object({
    project: z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().nullable(),
      color: z.string(),
      isPublic: z.boolean(),
      ownerId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
      owner: z.object({
        id: z.string(),
        name: z.string().nullable(),
        email: z.string().nullable(),
        username: z.string().nullable(),
        profilePicture: z
          .object({
            id: z.string(),
            key: z.string(),
            filetype: z.string(),
            bucket: z.string(),
            endpoint: z.string(),
          })
          .nullable(),
      }),
      members: z.array(
        z.object({
          id: z.string(),
          role: z.enum(["OWNER", "ADMIN", "MEMBER"]),
          createdAt: z.date(),
          user: z.object({
            id: z.string(),
            name: z.string().nullable(),
            email: z.string().nullable(),
            username: z.string().nullable(),
            profilePicture: z
              .object({
                id: z.string(),
                key: z.string(),
                filetype: z.string(),
                bucket: z.string(),
                endpoint: z.string(),
              })
              .nullable(),
          }),
        })
      ),
      tasks: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          description: z.string().nullable(),
          status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE"]),
          priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
          dueDate: z.date().nullable(),
          createdAt: z.date(),
          updatedAt: z.date(),
          assignee: z
            .object({
              id: z.string(),
              name: z.string().nullable(),
              email: z.string().nullable(),
              username: z.string().nullable(),
              profilePicture: z
                .object({
                  id: z.string(),
                  key: z.string(),
                  filetype: z.string(),
                  bucket: z.string(),
                  endpoint: z.string(),
                })
                .nullable(),
            })
            .nullable(),
          creator: z.object({
            id: z.string(),
            name: z.string().nullable(),
            email: z.string().nullable(),
            username: z.string().nullable(),
          }),
          _count: z.object({
            comments: z.number(),
            attachments: z.number(),
          }),
        })
      ),
      _count: z.object({
        tasks: z.number(),
        members: z.number(),
      }),
    }),
  })

// ===== LIST PROJECTS =====

export const listProjectsSchema = () =>
  z.object({
    page: z.number().min(1).default(1),
    perPage: z.number().min(1).max(100).default(10),
    search: z.string().optional(),
    isPublic: z.boolean().optional(),
  })

export const listProjectsResponseSchema = () =>
  z.object({
    projects: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string().nullable(),
        color: z.string(),
        isPublic: z.boolean(),
        ownerId: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
        owner: z.object({
          id: z.string(),
          name: z.string().nullable(),
          email: z.string().nullable(),
          username: z.string().nullable(),
          profilePicture: z
            .object({
              id: z.string(),
              key: z.string(),
              filetype: z.string(),
              bucket: z.string(),
              endpoint: z.string(),
            })
            .nullable(),
        }),
        _count: z.object({
          tasks: z.number(),
          members: z.number(),
        }),
      })
    ),
    meta: z.object({
      total: z.number(),
      page: z.number(),
      perPage: z.number(),
      totalPages: z.number(),
    }),
  })

// ===== DELETE PROJECT =====

export const deleteProjectSchema = () =>
  z.object({
    id: z.string(),
  })

export const deleteProjectResponseSchema = () =>
  z.object({
    success: z.boolean(),
  })

// ===== PROJECT MEMBERS =====

export const inviteUserSchemaDr = dictionaryRequirements({
  errors: {
    email: {
      required: true,
      invalid: true,
    },
  },
})

export const inviteUserSchema = (dictionary?: TDictionary<typeof inviteUserSchemaDr>) =>
  z.object({
    projectId: z.string(),
    email: z
      .string({
        required_error: dictionary && dictionary.errors.email.required,
      })
      .email(dictionary && dictionary.errors.email.invalid),
    role: z.enum(["ADMIN", "MEMBER"]).default("MEMBER"),
  })

export const inviteUserResponseSchema = () =>
  z.object({
    success: z.boolean(),
    notificationSent: z.boolean(),
    member: z.object({
      id: z.string(),
      role: z.enum(["OWNER", "ADMIN", "MEMBER"]),
      createdAt: z.date(),
      user: z.object({
        id: z.string(),
        name: z.string().nullable(),
        email: z.string().nullable(),
        username: z.string().nullable(),
        profilePicture: z
          .object({
            id: z.string(),
            key: z.string(),
            filetype: z.string(),
            bucket: z.string(),
            endpoint: z.string(),
          })
          .nullable(),
      }),
    }),
  })

export const removeMemberSchema = () =>
  z.object({
    projectId: z.string(),
    userId: z.string(),
  })

export const removeMemberResponseSchema = () =>
  z.object({
    success: z.boolean(),
  })

export const updateMemberRoleSchema = () =>
  z.object({
    projectId: z.string(),
    userId: z.string(),
    role: z.enum(["ADMIN", "MEMBER"]),
  })

export const updateMemberRoleResponseSchema = () =>
  z.object({
    success: z.boolean(),
    member: z.object({
      id: z.string(),
      role: z.enum(["OWNER", "ADMIN", "MEMBER"]),
      updatedAt: z.date(),
    }),
  })

import { z } from "zod"

import { TDictionary } from "@/lib/langs"
import { dictionaryRequirements } from "@/lib/utils/dictionary"

// ===== COMMENT SCHEMAS =====

export const commentContentSchemaDr = dictionaryRequirements({
  errors: {
    commentContent: {
      required: true,
      min1: true,
      max2000: true,
    },
  },
})

export const commentContentSchema = (dictionary?: TDictionary<typeof commentContentSchemaDr>) =>
  z
    .string({
      required_error: dictionary && dictionary.errors.commentContent.required,
    })
    .min(1, dictionary && dictionary.errors.commentContent.min1)
    .max(2000, dictionary && dictionary.errors.commentContent.max2000)

export const createCommentSchema = () =>
  z.object({
    taskId: z.string().min(1),
    content: z.string().min(1).max(2000),
  })

export const updateCommentSchema = () =>
  z.object({
    id: z.string().min(1),
    content: z.string().min(1).max(2000),
  })

export const getCommentSchema = z.object({
  id: z.string().min(1),
})

export const listCommentsSchema = z.object({
  taskId: z.string().min(1),
  page: z.number().int().min(1).default(1),
  perPage: z.number().int().min(1).max(100).default(20),
})

export const deleteCommentSchema = () =>
  z.object({
    id: z.string().min(1),
  })

// ===== RESPONSE SCHEMAS =====

export const createCommentResponseSchema = () =>
  z.object({
    notificationsSent: z.number(),
    comment: z.object({
      id: z.string(),
      content: z.string(),
      taskId: z.string(),
      authorId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
      author: z.object({
        id: z.string(),
        name: z.string().nullable(),
        email: z.string().nullable(),
        username: z.string().nullable(),
        profilePicture: z
          .object({
            key: z.string(),
          })
          .nullable(),
      }),
    }),
  })

export const updateCommentResponseSchema = () =>
  z.object({
    comment: z.object({
      id: z.string(),
      content: z.string(),
      taskId: z.string(),
      authorId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
      author: z.object({
        id: z.string(),
        name: z.string().nullable(),
        email: z.string().nullable(),
        username: z.string().nullable(),
        profilePicture: z
          .object({
            key: z.string(),
          })
          .nullable(),
      }),
    }),
  })

export const getCommentResponseSchema = () =>
  z.object({
    comment: z.object({
      id: z.string(),
      content: z.string(),
      taskId: z.string(),
      authorId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
      author: z.object({
        id: z.string(),
        name: z.string().nullable(),
        email: z.string().nullable(),
        username: z.string().nullable(),
        profilePicture: z
          .object({
            key: z.string(),
          })
          .nullable(),
      }),
    }),
  })

export const listCommentsResponseSchema = () =>
  z.object({
    comments: z.array(
      z.object({
        id: z.string(),
        content: z.string(),
        taskId: z.string(),
        authorId: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
        author: z.object({
          id: z.string(),
          name: z.string().nullable(),
          email: z.string().nullable(),
          username: z.string().nullable(),
          profilePicture: z
            .object({
              key: z.string(),
            })
            .nullable(),
        }),
      })
    ),
    pagination: z.object({
      page: z.number(),
      perPage: z.number(),
      total: z.number(),
      totalPages: z.number(),
    }),
  })

export const deleteCommentResponseSchema = () =>
  z.object({
    success: z.boolean(),
  })

// ===== DICTIONARY REQUIREMENTS =====

export const createCommentDictionaryRequirements = dictionaryRequirements({
  errors: {
    commentContent: true,
    commentNotFound: true,
    taskNotFound: true,
    unauthorizedCommentAccess: true,
  },
})

export const updateCommentDictionaryRequirements = dictionaryRequirements({
  errors: {
    commentContent: true,
    commentNotFound: true,
    unauthorizedCommentAccess: true,
  },
})

export const getCommentDictionaryRequirements = dictionaryRequirements({
  errors: {
    commentNotFound: true,
    unauthorizedCommentAccess: true,
  },
})

export const listCommentsDictionaryRequirements = dictionaryRequirements({
  errors: {
    taskNotFound: true,
    unauthorizedTaskAccess: true,
  },
})

export const deleteCommentDictionaryRequirements = dictionaryRequirements({
  errors: {
    commentNotFound: true,
    unauthorizedCommentAccess: true,
  },
})

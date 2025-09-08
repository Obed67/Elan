import { z } from "zod"

import { TDictionary } from "@/lib/langs"
import { dictionaryRequirements } from "@/lib/utils/dictionary"

// ===== NOTIFICATION SCHEMAS =====

export const notificationTitleSchemaDr = dictionaryRequirements({
  errors: {
    notificationTitle: {
      required: true,
      min1: true,
      max100: true,
    },
  },
})

export const notificationMessageSchemaDr = dictionaryRequirements({
  errors: {
    notificationMessage: {
      required: true,
      min1: true,
      max500: true,
    },
  },
})

export const notificationTitleSchema = (dictionary?: TDictionary<typeof notificationTitleSchemaDr>) =>
  z
    .string({
      required_error: dictionary && dictionary.errors.notificationTitle.required,
    })
    .min(1, dictionary && dictionary.errors.notificationTitle.min1)
    .max(100, dictionary && dictionary.errors.notificationTitle.max100)

export const notificationMessageSchema = (dictionary?: TDictionary<typeof notificationMessageSchemaDr>) =>
  z
    .string({
      required_error: dictionary && dictionary.errors.notificationMessage.required,
    })
    .min(1, dictionary && dictionary.errors.notificationMessage.min1)
    .max(500, dictionary && dictionary.errors.notificationMessage.max500)

export const listNotificationsSchema = () =>
  z.object({
    page: z.number().int().min(1).default(1),
    perPage: z.number().int().min(1).max(100).default(20),
    unreadOnly: z.boolean().default(false),
  })

export const markAsReadSchema = () =>
  z.object({
    id: z.string().min(1),
  })

export const markAllAsReadSchema = () => z.object({})

export const deleteNotificationSchema = () =>
  z.object({
    id: z.string().min(1),
  })

export const getNotificationSchema = () =>
  z.object({
    id: z.string().min(1),
  })

// ===== RESPONSE SCHEMAS =====

export const listNotificationsResponseSchema = () =>
  z.object({
    notifications: z.array(
      z.object({
        id: z.string(),
        type: z.enum([
          "TASK_ASSIGNED",
          "TASK_UPDATED",
          "TASK_COMMENTED",
          "PROJECT_INVITED",
          "PROJECT_UPDATED",
          "TASK_DUE_SOON",
          "TASK_OVERDUE",
        ]),
        title: z.string(),
        message: z.string(),
        isRead: z.boolean(),
        userId: z.string(),
        projectId: z.string().nullable(),
        taskId: z.string().nullable(),
        createdAt: z.date(),
        project: z
          .object({
            id: z.string(),
            name: z.string(),
            color: z.string(),
          })
          .nullable(),
        task: z
          .object({
            id: z.string(),
            title: z.string(),
            status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE"]),
          })
          .nullable(),
      })
    ),
    pagination: z.object({
      page: z.number(),
      perPage: z.number(),
      total: z.number(),
      totalPages: z.number(),
    }),
  })

export const markAsReadResponseSchema = () =>
  z.object({
    success: z.boolean(),
  })

export const markAllAsReadResponseSchema = () =>
  z.object({
    success: z.boolean(),
    count: z.number(),
  })

export const deleteNotificationResponseSchema = () =>
  z.object({
    success: z.boolean(),
  })

export const getNotificationResponseSchema = () =>
  z.object({
    notification: z.object({
      id: z.string(),
      type: z.enum([
        "TASK_ASSIGNED",
        "TASK_UPDATED",
        "TASK_COMMENTED",
        "PROJECT_INVITED",
        "PROJECT_UPDATED",
        "TASK_DUE_SOON",
        "TASK_OVERDUE",
      ]),
      title: z.string(),
      message: z.string(),
      isRead: z.boolean(),
      userId: z.string(),
      projectId: z.string().nullable(),
      taskId: z.string().nullable(),
      createdAt: z.date(),
      project: z
        .object({
          id: z.string(),
          name: z.string(),
          color: z.string(),
        })
        .nullable(),
      task: z
        .object({
          id: z.string(),
          title: z.string(),
          status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE"]),
        })
        .nullable(),
    }),
  })

export const getUnreadCountResponseSchema = () =>
  z.object({
    count: z.number(),
  })

// ===== DICTIONARY REQUIREMENTS =====

export const listNotificationsDictionaryRequirements = dictionaryRequirements({
  errors: {
    notificationNotFound: true,
  },
})

export const markAsReadDictionaryRequirements = dictionaryRequirements({
  errors: {
    notificationNotFound: true,
    unauthorizedNotificationAccess: true,
  },
})

export const markAllAsReadDictionaryRequirements = dictionaryRequirements({
  errors: {},
})

export const deleteNotificationDictionaryRequirements = dictionaryRequirements({
  errors: {
    notificationNotFound: true,
    unauthorizedNotificationAccess: true,
  },
})

export const getNotificationDictionaryRequirements = dictionaryRequirements({
  errors: {
    notificationNotFound: true,
    unauthorizedNotificationAccess: true,
  },
})

export const getUnreadCountDictionaryRequirements = dictionaryRequirements({
  errors: {},
})

import { z } from "zod"

import { TDictionary } from "@/lib/langs"
import { dictionaryRequirements } from "@/lib/utils/dictionary"

// ===== TASK SCHEMAS =====

export const taskTitleSchemaDr = dictionaryRequirements({
  errors: {
    taskTitle: {
      required: true,
      min3: true,
      max100: true,
    },
  },
})

export const taskTitleSchema = (dictionary?: TDictionary<typeof taskTitleSchemaDr>) =>
  z
    .string({
      required_error: dictionary && dictionary.errors.taskTitle.required,
    })
    .min(3, dictionary && dictionary.errors.taskTitle.min3)
    .max(100, dictionary && dictionary.errors.taskTitle.max100)

export const taskDescriptionSchemaDr = dictionaryRequirements({
  errors: {
    taskDescription: {
      max1000: true,
    },
  },
})

export const taskDescriptionSchema = (dictionary?: TDictionary<typeof taskDescriptionSchemaDr>) =>
  z
    .string()
    .max(1000, dictionary && dictionary.errors.taskDescription.max1000)
    .optional()

export const taskStatusSchema = () => z.enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE"])

export const taskPrioritySchema = () => z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"])

// ===== CREATE TASK =====

export const createTaskSchemaDr = dictionaryRequirements(taskTitleSchemaDr, taskDescriptionSchemaDr)
export const createTaskSchema = (dictionary?: TDictionary<typeof createTaskSchemaDr>) =>
  z.object({
    projectId: z.string(),
    title: taskTitleSchema(dictionary),
    description: taskDescriptionSchema(dictionary),
    status: taskStatusSchema().default("TODO"),
    priority: taskPrioritySchema().default("MEDIUM"),
    dueDate: z.date().optional(),
    assigneeId: z.string().optional(),
  })

export const createTaskResponseSchema = () =>
  z.object({
    task: z.object({
      id: z.string(),
      title: z.string(),
      description: z.string().nullable(),
      status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE"]),
      priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
      dueDate: z.date().nullable(),
      createdAt: z.date(),
      updatedAt: z.date(),
      projectId: z.string(),
      assigneeId: z.string().nullable(),
      creatorId: z.string(),
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
    }),
  })

// ===== UPDATE TASK =====

export const updateTaskSchemaDr = dictionaryRequirements(taskTitleSchemaDr, taskDescriptionSchemaDr)
export const updateTaskSchema = (dictionary?: TDictionary<typeof updateTaskSchemaDr>) =>
  z.object({
    id: z.string(),
    title: taskTitleSchema(dictionary).optional(),
    description: taskDescriptionSchema(dictionary),
    status: taskStatusSchema().optional(),
    priority: taskPrioritySchema().optional(),
    dueDate: z.date().optional(),
    assigneeId: z.string().optional(),
  })

export const updateTaskResponseSchema = () =>
  z.object({
    notificationSent: z.boolean(),
    task: z.object({
      id: z.string(),
      title: z.string(),
      description: z.string().nullable(),
      status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE"]),
      priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
      dueDate: z.date().nullable(),
      updatedAt: z.date(),
      assigneeId: z.string().nullable(),
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
    }),
  })

// ===== GET TASK =====

export const getTaskSchema = () =>
  z.object({
    id: z.string(),
  })

export const getTaskResponseSchema = () =>
  z.object({
    task: z.object({
      id: z.string(),
      title: z.string(),
      description: z.string().nullable(),
      status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE"]),
      priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
      dueDate: z.date().nullable(),
      createdAt: z.date(),
      updatedAt: z.date(),
      projectId: z.string(),
      assigneeId: z.string().nullable(),
      creatorId: z.string(),
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
      comments: z.array(
        z.object({
          id: z.string(),
          content: z.string(),
          isEdited: z.boolean(),
          createdAt: z.date(),
          author: z.object({
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
      attachments: z.array(
        z.object({
          id: z.string(),
          createdAt: z.date(),
          file: z.object({
            id: z.string(),
            key: z.string(),
            filetype: z.string(),
            bucket: z.string(),
            endpoint: z.string(),
          }),
        })
      ),
      _count: z.object({
        comments: z.number(),
        attachments: z.number(),
      }),
    }),
  })

// ===== LIST TASKS =====

export const listTasksSchema = () =>
  z.object({
    projectId: z.string(),
    page: z.number().min(1).default(1),
    perPage: z.number().min(1).max(100).default(10),
    status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE"]).optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
    assigneeId: z.string().optional(),
    search: z.string().optional(),
  })

export const listTasksResponseSchema = () =>
  z.object({
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
        assigneeId: z.string().nullable(),
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
    meta: z.object({
      total: z.number(),
      page: z.number(),
      perPage: z.number(),
      totalPages: z.number(),
    }),
  })

// ===== DELETE TASK =====

export const deleteTaskSchema = () =>
  z.object({
    id: z.string(),
  })

export const deleteTaskResponseSchema = () =>
  z.object({
    success: z.boolean(),
  })

// ===== ASSIGN TASK =====

export const assignTaskSchema = () =>
  z.object({
    taskId: z.string(),
    assigneeId: z.string(),
  })

export const assignTaskResponseSchema = () =>
  z.object({
    success: z.boolean(),
    notificationSent: z.boolean(),
    task: z.object({
      id: z.string(),
      assigneeId: z.string().nullable(),
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
    }),
  })

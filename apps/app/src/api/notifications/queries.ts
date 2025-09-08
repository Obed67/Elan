import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { ApiError, ensureLoggedIn, handleApiError } from "@/lib/utils/server-utils"
import { apiInputFromSchema } from "@/types"

import {
  getNotificationResponseSchema,
  getNotificationSchema,
  getUnreadCountResponseSchema,
  listNotificationsResponseSchema,
  listNotificationsSchema,
} from "./schemas"

// ===== GET NOTIFICATION =====

export const getNotification = async ({
  input,
  ctx: { session },
}: apiInputFromSchema<typeof getNotificationSchema>) => {
  ensureLoggedIn(session)
  try {
    const { id } = input

    const notification = await prisma.notification.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      select: {
        id: true,
        type: true,
        title: true,
        message: true,
        isRead: true,
        userId: true,
        projectId: true,
        taskId: true,
        createdAt: true,
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
    })

    if (!notification) {
      return ApiError("unknownError") // "notificationNotFound"
    }

    const data: z.infer<ReturnType<typeof getNotificationResponseSchema>> = { notification }
    return data
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

// ===== LIST NOTIFICATIONS =====

export const listNotifications = async ({
  input,
  ctx: { session },
}: apiInputFromSchema<typeof listNotificationsSchema>) => {
  ensureLoggedIn(session)
  try {
    const { page, perPage, unreadOnly } = input

    const skip = (page - 1) * perPage

    const where = {
      userId: session.user.id,
      ...(unreadOnly && { isRead: false }),
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        select: {
          id: true,
          type: true,
          title: true,
          message: true,
          isRead: true,
          userId: true,
          projectId: true,
          taskId: true,
          createdAt: true,
          project: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
          task: {
            select: {
              id: true,
              title: true,
              status: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: perPage,
      }),
      prisma.notification.count({ where }),
    ])

    const totalPages = Math.ceil(total / perPage)

    const data: z.infer<ReturnType<typeof listNotificationsResponseSchema>> = {
      notifications,
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

// ===== GET UNREAD COUNT =====

export const getUnreadCount = async ({
  input: _input,
  ctx: { session },
}: apiInputFromSchema<typeof listNotificationsSchema>) => {
  ensureLoggedIn(session)
  try {
    const count = await prisma.notification.count({
      where: {
        userId: session.user.id,
        isRead: false,
      },
    })

    const data: z.infer<ReturnType<typeof getUnreadCountResponseSchema>> = { count }
    return data
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

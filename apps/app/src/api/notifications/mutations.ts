import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { ApiError, ensureLoggedIn, handleApiError } from "@/lib/utils/server-utils"
import { apiInputFromSchema } from "@/types"

import {
  markAsReadResponseSchema,
  markAsReadSchema,
  markAllAsReadResponseSchema,
  markAllAsReadSchema,
  deleteNotificationResponseSchema,
  deleteNotificationSchema,
} from "./schemas"

// ===== MARK AS READ =====

export const markAsRead = async ({ input, ctx: { session } }: apiInputFromSchema<typeof markAsReadSchema>) => {
  ensureLoggedIn(session)
  try {
    const { id } = input

    // Vérifier que la notification existe et appartient à l'utilisateur
    const existingNotification = await prisma.notification.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingNotification) {
      return ApiError("unknownError") // "notificationNotFound"
    }

    await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    })

    const data: z.infer<ReturnType<typeof markAsReadResponseSchema>> = { success: true }
    return data
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

// ===== MARK ALL AS READ =====

export const markAllAsRead = async ({ input, ctx: { session } }: apiInputFromSchema<typeof markAllAsReadSchema>) => {
  ensureLoggedIn(session)
  try {
    const result = await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        isRead: false,
      },
      data: { isRead: true },
    })

    const data: z.infer<ReturnType<typeof markAllAsReadResponseSchema>> = {
      success: true,
      count: result.count,
    }
    return data
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

// ===== DELETE NOTIFICATION =====

export const deleteNotification = async ({
  input,
  ctx: { session },
}: apiInputFromSchema<typeof deleteNotificationSchema>) => {
  ensureLoggedIn(session)
  try {
    const { id } = input

    // Vérifier que la notification existe et appartient à l'utilisateur
    const existingNotification = await prisma.notification.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingNotification) {
      return ApiError("unknownError") // "notificationNotFound"
    }

    await prisma.notification.delete({
      where: { id },
    })

    const data: z.infer<ReturnType<typeof deleteNotificationResponseSchema>> = { success: true }
    return data
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

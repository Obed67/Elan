import { authenticatedProcedure, router } from "@/lib/server/trpc"

import { deleteNotification, markAllAsRead, markAsRead } from "./mutations"
import { getNotification, getUnreadCount, listNotifications } from "./queries"
import {
  deleteNotificationResponseSchema,
  deleteNotificationSchema,
  getNotificationResponseSchema,
  getNotificationSchema,
  getUnreadCountResponseSchema,
  listNotificationsResponseSchema,
  listNotificationsSchema,
  markAllAsReadResponseSchema,
  markAllAsReadSchema,
  markAsReadResponseSchema,
  markAsReadSchema,
} from "./schemas"

export const notificationsRouter = router({
  list: authenticatedProcedure
    .input(listNotificationsSchema())
    .output(listNotificationsResponseSchema())
    .query(listNotifications),

  get: authenticatedProcedure
    .input(getNotificationSchema())
    .output(getNotificationResponseSchema())
    .query(getNotification),

  getUnreadCount: authenticatedProcedure
    .input(listNotificationsSchema())
    .output(getUnreadCountResponseSchema())
    .query(getUnreadCount),

  markAsRead: authenticatedProcedure.input(markAsReadSchema()).output(markAsReadResponseSchema()).mutation(markAsRead),

  markAllAsRead: authenticatedProcedure
    .input(markAllAsReadSchema())
    .output(markAllAsReadResponseSchema())
    .mutation(markAllAsRead),

  delete: authenticatedProcedure
    .input(deleteNotificationSchema())
    .output(deleteNotificationResponseSchema())
    .mutation(deleteNotification),
})

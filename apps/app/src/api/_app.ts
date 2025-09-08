import { router } from "../lib/server/trpc"

import { authRouter } from "./auth/_router"
import { commentsRouter } from "./comments/_router"
import { meRouter } from "./me/_router"
import { notificationsRouter } from "./notifications/_router"
import { projectsRouter } from "./projects/_router"
import { tasksRouter } from "./tasks/_router"
import { uploadRouter } from "./upload/_router"

export const appRouter = router({
  auth: authRouter,
  me: meRouter,
  projects: projectsRouter,
  tasks: tasksRouter,
  comments: commentsRouter,
  notifications: notificationsRouter,
  upload: uploadRouter,
})

export type AppRouter = typeof appRouter

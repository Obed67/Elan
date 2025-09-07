import { router } from "../lib/server/trpc"

import { authRouter } from "./auth/_router"
import { meRouter } from "./me/_router"
import { projectsRouter } from "./projects/_router"
import { tasksRouter } from "./tasks/_router"
import { uploadRouter } from "./upload/_router"

export const appRouter = router({
  auth: authRouter,
  me: meRouter,
  projects: projectsRouter,
  tasks: tasksRouter,
  upload: uploadRouter,
})

export type AppRouter = typeof appRouter

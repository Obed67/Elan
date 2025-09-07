import {
  assignTaskResponseSchema,
  assignTaskSchema,
  createTaskResponseSchema,
  createTaskSchema,
  deleteTaskResponseSchema,
  deleteTaskSchema,
  getTaskResponseSchema,
  getTaskSchema,
  listTasksResponseSchema,
  listTasksSchema,
  updateTaskResponseSchema,
  updateTaskSchema,
} from "@/api/tasks/schemas"
import { authenticatedProcedure, router } from "@/lib/server/trpc"

import { assignTask, createTask, deleteTask, updateTask } from "./mutations"
import { getTask, listTasks } from "./queries"

export const tasksRouter = router({
  // ===== TASK CRUD =====
  create: authenticatedProcedure
    .input(createTaskSchema())
    .output(createTaskResponseSchema())
    .mutation(createTask),

  list: authenticatedProcedure
    .input(listTasksSchema())
    .output(listTasksResponseSchema())
    .query(listTasks),

  getById: authenticatedProcedure
    .input(getTaskSchema())
    .output(getTaskResponseSchema())
    .query(getTask),

  update: authenticatedProcedure
    .input(updateTaskSchema())
    .output(updateTaskResponseSchema())
    .mutation(updateTask),

  delete: authenticatedProcedure
    .input(deleteTaskSchema())
    .output(deleteTaskResponseSchema())
    .mutation(deleteTask),

  // ===== TASK ASSIGNMENT =====
  assign: authenticatedProcedure
    .input(assignTaskSchema())
    .output(assignTaskResponseSchema())
    .mutation(assignTask),
})

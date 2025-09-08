import { authenticatedProcedure, router } from "@/lib/server/trpc"

import { createComment, deleteComment, updateComment } from "./mutations"
import { getComment, listComments } from "./queries"
import {
  createCommentResponseSchema,
  createCommentSchema,
  deleteCommentResponseSchema,
  deleteCommentSchema,
  getCommentResponseSchema,
  getCommentSchema,
  listCommentsResponseSchema,
  listCommentsSchema,
  updateCommentResponseSchema,
  updateCommentSchema,
} from "./schemas"

export const commentsRouter = router({
  create: authenticatedProcedure
    .input(createCommentSchema())
    .output(createCommentResponseSchema())
    .mutation(createComment),

  update: authenticatedProcedure
    .input(updateCommentSchema())
    .output(updateCommentResponseSchema())
    .mutation(updateComment),

  get: authenticatedProcedure.input(getCommentSchema).output(getCommentResponseSchema()).query(getComment),

  list: authenticatedProcedure.input(listCommentsSchema).output(listCommentsResponseSchema()).query(listComments),

  delete: authenticatedProcedure
    .input(deleteCommentSchema())
    .output(deleteCommentResponseSchema())
    .mutation(deleteComment),
})

import {
  createProjectResponseSchema,
  createProjectSchema,
  deleteProjectResponseSchema,
  deleteProjectSchema,
  getProjectResponseSchema,
  getProjectSchema,
  inviteUserResponseSchema,
  inviteUserSchema,
  listProjectsResponseSchema,
  listProjectsSchema,
  removeMemberResponseSchema,
  removeMemberSchema,
  updateMemberRoleResponseSchema,
  updateMemberRoleSchema,
  updateProjectResponseSchema,
  updateProjectSchema,
} from "@/api/projects/schemas"
import { authenticatedProcedure, router } from "@/lib/server/trpc"

import { createProject, deleteProject, inviteUser, removeMember, updateMemberRole, updateProject } from "./mutations"
import { getProject, listProjects } from "./queries"

export const projectsRouter = router({
  // ===== PROJECT CRUD =====
  create: authenticatedProcedure
    .input(createProjectSchema())
    .output(createProjectResponseSchema())
    .mutation(createProject),

  list: authenticatedProcedure
    .input(listProjectsSchema())
    .output(listProjectsResponseSchema())
    .query(listProjects),

  getById: authenticatedProcedure
    .input(getProjectSchema())
    .output(getProjectResponseSchema())
    .query(getProject),

  update: authenticatedProcedure
    .input(updateProjectSchema())
    .output(updateProjectResponseSchema())
    .mutation(updateProject),

  delete: authenticatedProcedure
    .input(deleteProjectSchema())
    .output(deleteProjectResponseSchema())
    .mutation(deleteProject),

  // ===== PROJECT MEMBERS =====
  inviteUser: authenticatedProcedure.input(inviteUserSchema()).output(inviteUserResponseSchema()).mutation(inviteUser),

  removeMember: authenticatedProcedure
    .input(removeMemberSchema())
    .output(removeMemberResponseSchema())
    .mutation(removeMember),

  updateMemberRole: authenticatedProcedure
    .input(updateMemberRoleSchema())
    .output(updateMemberRoleResponseSchema())
    .mutation(updateMemberRole),
})

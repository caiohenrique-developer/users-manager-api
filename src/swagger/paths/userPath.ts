import z from 'zod'

import type { RouteConfig } from '@asteasolutions/zod-to-openapi'

import { userCreateSchema, userExample, userIDSchema, userUpdateSchema } from '@/swagger/schemas/userSchema'

const getUsersPath: RouteConfig = {
  tags: ['Users'],
  method: 'get',
  path: '/users',
  summary: 'Get users list',
  description: 'Get list of all users',
  security: [{ authCookie: [] }],
  responses: {
    200: { description: 'User list found', content: { 'application/json': { schema: z.object({ message: z.string().openapi({ example: 'User list found' }), data: z.array(z.intersection(userIDSchema, userExample)) }) } } },
    403: { description: 'Unauthorized', content: { 'application/json': { schema: z.object({ message: z.string().openapi({ example: 'You do not have permission to view this user list' }) }) } } },
    404: { description: 'Not Found', content: { 'application/json': { schema: z.object({ message: z.string().openapi({ example: 'Token not found' }) }) } } },
  },
}

const getUserByIdPath: RouteConfig = {
  tags: ['Users'],
  method: 'get',
  path: '/users/{id}',
  summary: 'Get a single user',
  description: 'Get user data by its id',
  security: [{ authCookie: [] }],
  request: { params: userIDSchema },
  responses: {
    200: { description: 'User found', content: { 'application/json': { schema: z.object({ message: z.string().openapi({ example: 'User found' }), data: z.intersection(userIDSchema, userExample) }) } } },
    403: { description: 'Unauthorized', content: { 'application/json': { schema: z.object({ message: z.string().openapi({ example: 'You do not have permission to view this user' }) }) } } },
    404: { description: 'Not Found', content: { 'application/json': { schema: z.object({ message: z.string().openapi({ example: 'Token not found' }) }) } } },
  },
}

const createUserPath: RouteConfig = {
  tags: ['Users'],
  method: 'post',
  path: '/users/create',
  summary: 'Create user',
  description: 'Create a new user',
  security: [{ authCookie: [] }],
  request: { body: { content: { 'application/json': { schema: userCreateSchema } } } },
  responses: {
    201: { description: 'User created', content: { 'application/json': { schema: z.object({ message: z.string().openapi({ example: 'User created' }), data: z.intersection(userIDSchema, userExample) }) } } },
    403: { description: 'Unauthorized', content: { 'application/json': { schema: z.object({ message: z.string().openapi({ example: 'You do not have permission to create a user with this role' }) }) } } },
  },
}

const updateUserPath: RouteConfig = {
  tags: ['Users'],
  method: 'put',
  path: '/users/{id}/update',
  summary: 'Atualiza um usuário',
  description: 'Atualização de um usuário',
  security: [{ authCookie: [] }],
  request: { params: userIDSchema, body: { content: { 'application/json': { schema: userUpdateSchema } } } },
  responses: {
    200: { description: 'User updated', content: { 'application/json': { schema: z.object({ message: z.string().openapi({ example: 'User updated' }), data: z.intersection(userIDSchema, userExample) }) } } },
    403: { description: 'Unauthorized', content: { 'application/json': { schema: z.object({ message: z.string().openapi({ example: 'You do not have permission to view this user' }) }) } } },
  },
}

const removeUserPath: RouteConfig = {
  tags: ['Users'],
  method: 'delete',
  path: '/users/{id}/remove',
  summary: 'Delete user',
  description: 'Delete a user by its id',
  security: [{ authCookie: [] }],
  request: { params: userIDSchema },
  responses: {
    204: { description: 'User removed', content: { 'application/json': { schema: z.object({ message: z.string().openapi({ example: 'User removed' }) }) } } },
    403: { description: 'Unauthorized', content: { 'application/json': { schema: z.object({ message: z.string().openapi({ example: 'You do not have permission to view this user' }) }) } } },
  },
}

export { createUserPath, getUserByIdPath, getUsersPath, removeUserPath, updateUserPath }

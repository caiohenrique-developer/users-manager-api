import { z } from 'zod'

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'

extendZodWithOpenApi(z)

const userExample = z.object({
  name: z.string().min(1).openapi({ example: 'John Doe' }),
  email: z.string().email({ message: 'Invalid email address' }).openapi({ example: 'john@doe.com' }),
  password: z.string().min(1, { message: 'Password must be at least 1 characters long' }).max(4, { message: 'Password must be at most 4 characters long' }).openapi({ example: '1234' }),
  role: z.enum(['USER', 'ADMIN']).default('USER').openapi({ example: 'USER' }),
})

const userIDSchema = z.object({ id: z.string().openapi({ example: '68173742185f2a6e530c7275' }) })

const getUsersListSchema = userIDSchema.partial()
const userCreateSchema = userExample.partial()
const userUpdateSchema = userExample.partial()
const userRemoveSchema = userIDSchema.partial()

export { getUsersListSchema, userCreateSchema, userExample, userIDSchema, userRemoveSchema, userUpdateSchema }

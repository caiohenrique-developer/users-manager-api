import type { User } from '../../../generated/prisma'

export enum UserRoleEnum {
  user = 'USER',
  admin = 'ADMIN',
}

export type UserInfo = Omit<User, 'password'> & { iat: number; exp: number }

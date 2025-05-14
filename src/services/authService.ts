import { AppError } from '@/utils/appError'
import { comparePassword } from '@/utils/encryptPassword'
import { prisma } from '@/utils/prisma'
import { generateToken } from '@/utils/tokenGenerator'

interface LoginServiceProps {
  email: string
  password: string
}

interface LoginServiceResponseProps {
  email: string
  token: string
}

async function loginService({ email, password }: LoginServiceProps): Promise<LoginServiceResponseProps> {
  if (!email || !password) {
    throw new AppError('User email or user password are required', 400)
  }

  const userExists = await prisma.user.findUnique({ where: { email } })

  if (!userExists) {
    throw new AppError('User not found', 404)
  }

  const { id, name, email: userEmail, password: userPassword, role } = userExists

  const isPasswordValid = await comparePassword(password, userPassword)

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401)
  }

  const token = generateToken({ id, name, email: userEmail, role })

  return { email, token }
}

export { loginService }

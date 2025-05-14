import { compare, hash } from 'bcrypt'

const comparePassword = async (password: string, encryptedPassword: string): Promise<boolean> => await compare(password, encryptedPassword)

const encryptPassword = async (password: string): Promise<string> => await hash(password, 10)

export { comparePassword, encryptPassword }

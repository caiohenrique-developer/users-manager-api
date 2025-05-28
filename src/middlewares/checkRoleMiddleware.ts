import type { NextFunction, Request, Response } from 'express'

import type { UserRoleEnum } from '@/@types/userInfo'

export function checkRoleMiddleware(...allowedRoles: UserRoleEnum[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.userInfo?.role

    if (!userRole || !allowedRoles.includes(userRole as UserRoleEnum)) {
      res.status(403).json({ message: 'Access Denied: Insufficient Permission' })
      return
    }

    next()
  }
}

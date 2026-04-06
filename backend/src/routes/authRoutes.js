import { Router } from 'express'
import {
  createUserByAdmin,
  deleteUserByAdmin,
  listUsers,
  login,
  me,
  register,
  updateUserRoleStatus,
} from '../controllers/authController.js'
import { authRequired } from '../middleware/authRequired.js'
import { requireRole } from '../middleware/requireRole.js'

const authRouter = Router()

authRouter.post('/auth/register', register)
authRouter.post('/auth/login', login)
authRouter.get('/auth/me', authRequired, me)
authRouter.get('/admin/users', authRequired, requireRole(['admin']), listUsers)
authRouter.post('/admin/users', authRequired, requireRole(['admin']), createUserByAdmin)
authRouter.patch('/admin/users/:id', authRequired, requireRole(['admin']), updateUserRoleStatus)
authRouter.delete('/admin/users/:id', authRequired, requireRole(['admin']), deleteUserByAdmin)

export default authRouter

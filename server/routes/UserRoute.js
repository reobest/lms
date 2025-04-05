import express from 'express'
import { getAllUsers,getuserEnrolledCources,purchaseCourse } from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.get('/users',getAllUsers)
userRouter.get('/enrolled-courses',getuserEnrolledCources)
userRouter.post('/purchase',purchaseCourse)


export default userRouter;
import express from 'express'
import { getAllUsers,getuserEnrolledCources,purchaseCourse,updateUserCourseProgress,getuserCourseProgress,addUserRating } from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.get('/users',getAllUsers)
userRouter.get('/enrolled-courses',getuserEnrolledCources)
userRouter.post('/purchase',purchaseCourse)
userRouter.post('/update-course-progress',updateUserCourseProgress)
userRouter.post('/get-course-progress',getuserCourseProgress)
userRouter.post('/add-rating',addUserRating)



export default userRouter;
import express from "express";
import { addCourse, educatorDashboardData, getEducatorCources, getEnrolledStudentsData, updateRuleToEducator } from "../controllers/educatorController.js";
import { protectEducator } from "../middlewares/authMiddleware.js";
import upload from "../configs/multer.js";
const educatorRouter = express.Router()

educatorRouter.get('/update-role',updateRuleToEducator)
educatorRouter.post('/add-course',upload.single('image'),protectEducator,addCourse)
educatorRouter.get('/courses',protectEducator,getEducatorCources)
educatorRouter.get('/dashboard',protectEducator,educatorDashboardData)
educatorRouter.get('/enrolled-students',protectEducator,getEnrolledStudentsData)

export default educatorRouter
import { clerkClient } from '@clerk/express'
import Course from '../models/Course.js'
import { v2 as cloudinary } from 'cloudinary'
import { Purchase } from '../models/Purchase.js'
import User from '../models/User.js'
export const updateRuleToEducator = async (req, res) => {
    try {
        const userId = req.auth.userId
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator'
            }
        })
        res.json({ success:true,message: "You can now post videos" })
    } catch (error) {
        res.json({success:false, message: error.message })
    }
}


export const addCourse = async (req, res) => {
    try {
        const { courseData } = req.body
        const imageFile = req.file
        const educatorId = req.auth.userId
        if (!imageFile) res.json({ message: "No Thumbnail" })

        const parsedCourseData = await JSON.parse(courseData)
        parsedCourseData.educator = educatorId
        const newCourse = await Course.create(parsedCourseData)
        const imageUpload = await cloudinary.uploader.upload(imageFile.path)
        newCourse.courseThumbnail = imageUpload.secure_url
        await newCourse.save()
        return res.json({success:true, message: "New Course Added" })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}
export const getEducatorCources = async (req, res) => {
    try {
        const educator = req.auth.userId
        const courses = await Course.find({ educator })
        res.json({ success:true,courses })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const educatorDashboardData = async (req, res) => {
    try {
        const educator = req.auth.userId
        console.log(educator);
        
        const courses = await Course.find({ educator })
        console.log(courses);
        
        const totalCources = courses.length
        const courseIds = courses.map(course => course._id)
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        })
        const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0)
        const enrolledStudentsData = []
        for (const course of courses) {
            const students = await User.find({
                _id: { $in: course.enrolledStudents }
            }, 'name imageUrl')
            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                })
            })
        }
        res.json({
            success: true, dashboardData: {
                totalEarnings, enrolledStudentsData, totalCources
            }
        })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const getEnrolledStudentsData = async (req, res) => {
    try {
        const educator = req.auth.userId
        const courses = await Course.find({ educator })
        const courseIds = courses.map(course => course._id)
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle')
        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseData: purchase.createdAt
        }))
        res.json({ success: true, enrolledStudents })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}
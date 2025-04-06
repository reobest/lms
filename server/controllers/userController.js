import Course from "../models/Course.js"
import { Purchase } from "../models/Purchase.js"
import User from "../models/User.js"
import Stripe from "stripe"
import CourseProgress from '../models/courseProgress.js'
export const getAllUsers = async (req, res) => {
    try {
        const userId = req.auth.userId
        const user = await User.findById(userId)
        if (!user) res.json({ success: "False", message: "User not found" })
        res.json({ success: "True", message: user })
    } catch (error) {
        res.json({ success: "False", message: error.message })
    }
}
export const getuserEnrolledCources = async (req, res) => {
    try {
        const userId = req.auth.userId
        const user = await User.findById(userId).populate('enrolledCources')
        if (!user) res.json({ success: "False", message: "User not found" })
        res.json({ success: "True", message: user.enrolledCources })
    } catch (error) {
        res.json({ success: "False", message: error.message })
    }
}
export const purchaseCourse = async (req, res) => {
    try {
        const { courseId } = req.body
        const { origin } = req.headers
        const userId = req.auth.userId
        const userData = await User.findById(userId)
        const courseData = await Course.findById(courseId)

        if (!userData || !courseData) res.json({ success: "False", message: "User not found or Course not found" })

        const purchaseData = {
            courseId: courseData._id,
            userId,
            amount: Number((courseData.coursePrice - (courseData.discount * courseData.coursePrice / 100)).toFixed(2)),
        }
        const newPurchase = await Purchase.create(purchaseData)
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
        const currency = process.env.CURRENCY.toLowerCase()
        const line_items = [{
            price_data: {
                currency,
                product_data: {
                    name: courseData.courseTitle
                },
                unit_amount: Math.floor(newPurchase.amount) * 100
            },
            quantity: 1
        }]
        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}`,
            line_items: line_items,
            mode: 'payment',
            metadata: {
                purchaseId: newPurchase._id.toString()
            }
        })
        res.json({ success: true, session_url: session.url })
    } catch (error) {
        res.json({ success: "False", message: error.message })
    }
}
export const updateUserCourseProgress = async (req, res) => {
    const userId = req.auth.userId
    const { courseId, lectureId } = req.body
    try {
        const progressData = await CourseProgress.findOne({ userId, courseId })
        if (progressData) {
            if (progressData.lectureCompleted.includes(lectureId)) {
                return res.json({ success: true, message: "Lecture already completed" })
            }
            progressData.lectureCompleted.push(lectureId)
            await progressData.save()
        } else {
            await progressData.create({
                userId,
                courseId,
                lectureCompleted: [lectureId]
            })
        }
        res.json({ success: true, message: "Progress Updated!" })
    } catch (error) {
        res.json({ success: false, message: error.message })

    }
}

export const getuserCourseProgress = async (req, res) => {
    try {
        const userId = req.auth.userId
        const { courseId } = req.body
        const progressData = await CourseProgress.findOne({ userId, courseId })
        res.json({ success: true, message: progressData })
    } catch (error) {
        res.json({ success: "False", message: error.message })
    }
}

export const addUserRating = async (req, res) => {
    const userId = req.auth.userId
    const { courseId, rating } = req.body
    if (!userId || !courseId || !rating || rating < 1 || rating > 5) {
        res.json({ success: false, message: "Invalid Data" })
    }
    try {
        const course = await Course.findById(courseId)
        if (!course) {
            res.json({ success: false, message: "course Not Found" })
        }
        const user = await User.findById(userId)
        if(!user || !user.enrolledCources.includes(courseId)){
            res.json({ success: false, message: "User has not purchesed this course" })
        }
        const existingRatingIndex = course.courseRatings.findIndex(r => r.userId === userId)
        if(existingRatingIndex > -1){
            course.courseRatings[existingRatingIndex].rating = rating
        }else{
            course.courseRatings.push({userId,rating})
        }
        await course.save()
        res.json({ success: true, message: "Rating Added" })
    } catch (error) {
        res.json({ success: "False", message: error.message })
    }
}
import Course from "../models/Course.js"
import { Purchase } from "../models/Purchase.js"
import User from "../models/User.js"
import Stripe from "stripe"
export const getAllUsers = async(req,res) => {
    try { 
        const userId = req.auth.userId
        const user = await User.findById(userId)
        if(!user) res.json({success:"False",message:"User not found"})
            res.json({success:"True",message:user})
    } catch (error) {
        res.json({success:"False",message:error.message})
    }
}
export const getuserEnrolledCources = async(req,res) => {
    try {
        const userId = req.auth.userId
        const user = await User.findById(userId).populate('enrolledCources')
        if(!user) res.json({success:"False",message:"User not found"})
            res.json({success:"True",message:user.enrolledCources})
    } catch (error) {
        res.json({success:"False",message:error.message})
    }
}
export const purchaseCourse = async(req,res) => {
    try {
        const {courseId} = req.body
        const {origin} = req.headers
        const userId = req.auth.userId
        const userData = await User.findById(userId)
        const courseData = await Course.findById(courseId)

        if(!userData || !courseData) res.json({success:"False",message:"User not found or Course not found"})

            const purchaseData = {
                courseId:courseData._id,
                userId,
                amount:Number((courseData.coursePrice - (courseData.discount * courseData.coursePrice / 100)).toFixed(2)),
            }
            const newPurchase = await Purchase.create(purchaseData)
            const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
            const currency = process.env.CURRENCY.toLowerCase()
            const line_items = [{
                price_data:{
                    currency,
                    product_data:{
                        name:courseData.courseTitle
                    },
                    unit_amount:Math.floor(newPurchase.amount) * 100
                },
                quantity:1
            }]
            const session = await stripeInstance.checkout.sessions.create({
                success_url:`${origin}/loading/my-enrollments`,
                cancel_url:`${origin}`,
                line_items:line_items,
                mode:'payment',
                metadata:{
                    purchaseId:newPurchase._id.toString()
                }
            })
            res.json({success:true,session_url:session.url})
    } catch (error) {
        res.json({success:"False",message:error.message})
    }
}
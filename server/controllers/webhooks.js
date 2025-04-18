import { Webhook } from "svix";
import User from "../models/User.js";
import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";


export const ClerkWebHooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        })
        console.log(req.headers);

        const { data, type } = req.body

        switch (type) {
            case "user.created": {
                const userData = {
                    _id: data.id,
                    name: data.first_name + " " + data.last_name,
                    email: data.email_addresses[0].email_address,
                    imageUrl: data.image_url,
                }
                console.log(userData);

                await User.create(userData)
                 res.json({})
                break;
            }
            case "user.updated": {
                const userData = {
                    name: data.first_name + " " + data.last_name,
                    email: data.email_addresses[0].email_address,
                    imageUrl: data.image_url,
                }
                const updated = await User.findByIdAndUpdate(data.id, userData)
                console.log(updated);
                
                if(!updated){
                    await User.create({ _id: data.id, ...userData });
                }
                 res.json({})
                break;
            }
            case "user.deleted": {
                await User.findByIdAndDelete(data.id, userData)
                 res.json({})
                break;
            }
        }
    } catch (error) {
        console.error("Webhook Error:", error);
        return res.json({ message: error.message })
    }
}
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
export const stripeWebhooks = async (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = Stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
    }
    switch (event.type) {
        case 'payment_intent.succeeded':{
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId
            })
            const { purchaseId } = session.data[0].metadata
            const purchaseData = await Purchase.findById(purchaseId)
            const userData = await User.findById(purchaseData.userId)
            const courseData = await Course.findById(purchaseData.courseId)
            courseData.enrolledStudents.push(userData)
            await courseData.save()
            userData.enrolledCources.push(courseData._id)
            await userData.save()
            purchaseData.status = 'completed'
            await purchaseData.save()
            break
        }
        case 'payment_method.attached':{
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId
            })
            const { purchaseId } = session.data[0].metadata
            const purchaseData = await Purchase.findById(purchaseId)
            purchaseData.status = 'failed'
            await purchaseData.save()
            break;
        }
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    response.json({ received: true });

}
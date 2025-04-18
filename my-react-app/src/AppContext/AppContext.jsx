import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from 'humanize-duration'
import { useUser, useAuth } from '@clerk/clerk-react'
import axios from 'axios'
import { toast } from "react-toastify";
export const appContext = createContext();

export const AppContextProvider = (props) => {
    const { getToken } = useAuth()
    const { user } = useUser()
    const [enrolledCourses,setEnrolledCourses] = useState([])
    const [isSubsribed, setIsSubsribed] = useState(false)
    const [isEducator, setIsEducator] = useState(false)
    const [allCources, setAllCources] = useState([])
    const [userData, setUserData] = useState(null)
    const [email, setEmail] = useState("")
    const navigate = useNavigate()
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    
    const fetchUserData = async () => {
        if (user.publicMetadata.role === 'educator') {
            setIsEducator(true)
        }
        try {
            const token = await getToken()
            const { data } = await axios.get(backendUrl + '/api/user/users', { headers: { Authorization: `Bearer ${token}` } })
            if (data.success) {
                setUserData(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    const fetchAllCources = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/course/all')
            if (data.success) {
                setAllCources(data.courses)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const averageRating = (course) => {
        let totalRatings = 0
        let numOfratings = course.courseRatings.length
        if (numOfratings == 0) {
            return 0
        }
        if(course){
            course?.courseRatings?.forEach((rate) => {
                totalRatings += rate.rating
            })
        }
        return Math.floor(totalRatings / numOfratings)

    }
    const handleSubscribe = () => {
        if (email && !email.includes('@')) {
            alert("Please enter a valid email!")
            setEmail("")
            return
        }
        if (email) {
            scrollTo({ top: 0, behavior: "smooth" })
            setIsSubsribed(true)
            setTimeout(() => {
                setIsSubsribed(false)
            }, 2000)
            setEmail("")
            return
        }
        alert("Please enter your email!")
        setEmail("")
    }

    const TotalNumberOfLectures = (course) => {
        let counter = 0
        course?.courseContent?.map((chapter) => {
            counter += chapter.chapterContent.length
        })
        return counter
    }
    const totalDurationTime = (course) => {
        let time = 0
        course?.courseContent?.map((chapter) => chapter.chapterContent.map((lecture) => time += lecture.lectureDuration))
        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] })
    }
    const totalChapterTime = (chapter) => {
        let time = 0
        chapter.chapterContent.map((lecture) => time += lecture.lectureDuration)
        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] })
    }

    const fetchUserEnrolledCourses = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get(backendUrl + '/api/user/enrolled-courses', { headers: { Authorization: `Bearer ${token}` } })
            console.log(data);
            
            if (data.success) {
                setEnrolledCourses(data.enrolledCourses.reverse())
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    
    useEffect(() => {
        if (user) {
            fetchUserData()
            fetchUserEnrolledCourses()
        }
    }, [user])
    useEffect(() => {
        fetchAllCources()
    }, [])

    const value = {
        navigate, averageRating, handleSubscribe, email, setEmail,
        isSubsribed, setIsSubsribed, TotalNumberOfLectures, totalDurationTime, totalChapterTime, allCources, fetchUserData, userData, setUserData,
        isEducator, setIsEducator , fetchUserEnrolledCourses , enrolledCourses , setEnrolledCourses,getToken,backendUrl
    }
    return (
        <appContext.Provider value={value}>
            {props.children}
        </appContext.Provider>
    )
}


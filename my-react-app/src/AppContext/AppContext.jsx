import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from 'humanize-duration'
import {useUser,useAuth} from '@clerk/clerk-react'
export const appContext = createContext();

export const AppContextProvider = (props) => {
    const {getToken} = useAuth()
    const {user} = useUser()
    const [isSubsribed, setIsSubsribed] = useState(false)
    const [email, setEmail] = useState("")
    const navigate = useNavigate()
    const averageRating = (course) => {
        let totalRatings = 0
        let numOfratings = course.courseRatings.length
        if (numOfratings == 0) {
            return 0
        }
        course.courseRatings.map((rate) => {
            totalRatings += rate.rating
        })
        return totalRatings / numOfratings

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
        course.courseContent.map((chapter) => {
            counter += chapter.chapterContent.length
        })
        return counter
    }
    const totalDurationTime = (course) => {
        let time = 0
        course.courseContent.map((chapter) => chapter.chapterContent.map((lecture) => time+= lecture.lectureDuration))
        return humanizeDuration(time*60*1000,{units:["h","m"]})
    }
    const totalChapterTime = (chapter) => {
        let time = 0
        chapter.chapterContent.map((lecture) => time+= lecture.lectureDuration)
        return humanizeDuration(time*60*1000,{units:["h","m"]})
    }
    const getTokenn = async () => {
        const token = await getToken()
        console.log(token);
        
    }
    useEffect(() => {
      if(user){
        getTokenn()
      }
    
    }, [user])
    

    const value = { navigate, averageRating, handleSubscribe, email, setEmail, 
        isSubsribed, setIsSubsribed ,TotalNumberOfLectures ,totalDurationTime ,totalChapterTime  }
    return (
        <appContext.Provider value={value}>
            {props.children}
        </appContext.Provider>
    )
}


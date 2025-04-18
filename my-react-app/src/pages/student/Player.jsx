import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../../assets/assets/assets'
import humanizeDuration from 'humanize-duration'
import { appContext } from '../../AppContext/AppContext'
import Loading from '../../components/student/Loading'
import { useParams } from 'react-router-dom'
import Youtube from 'react-youtube'
import Footer from '../../components/student/Footer'
import Rating from '../../components/student/Rating'
import { toast } from 'react-toastify'
import axios from 'axios'
const Player = () => {
  const { courseId } = useParams()
  const [hideSections, setHideSections] = useState({})
  const [course, setCourse] = useState(null)
  const [player, setPlayer] = useState({
    videoId:'',
    lectureId:'',
    name:''
  })
  const [progressData,setProgressData] = useState(null)
  const [initialRating,setInitialRating] = useState(0)
  const { totalChapterTime,enrolledCourses ,userData,getToken,backendUrl,fetchUserEnrolledCourses} = useContext(appContext)
  const handleSections = (index) => {
    setHideSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }
  const getCourseData = () => {
    enrolledCourses.map(course => {
      if(course._id == courseId){
        setCourse(course)
      }
      course.courseRatings.map((item) => {
        if(item.userId ==userData._id){
          setInitialRating(item.rating)
        }
      })
    })
  }
  useEffect(() => {
    if(enrolledCourses.length > 0){
      getCourseData()
    }  
  }, [enrolledCourses]);
  const markLectureAsCompleted = async (lectureId) => {
    try {
      const token = await getToken()
      console.log(token);
      
      const {data} = await axios.post(backendUrl + '/api/user/update-course-progress',{courseId,lectureId},{headers:{Authorization:`Bearer ${token}`}})
      if(data.success){
        toast.success(data.message)
        getCourseProgress()
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  const getCourseProgress = async () => {
    try {
      const token =  await getToken()
      const {data} = await axios.post(`${backendUrl}/api/user/get-course-progress`,{courseId},{headers :{Authorization:`Bearer ${token}`}})
      if(data.success){
        setProgressData(data.progressData)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  console.log(progressData);
  
  const handleRate = async (rating) => {
    try {
      const token =  await getToken()
      const {data} = await axios.post(backendUrl + '/api/user/add-rating',{courseId,rating},{headers:{Authorization:`Bearer ${token}`}})
      if(data.success){
        toast.success(data.message)
        fetchUserEnrolledCourses()
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

 useEffect(() => {
  getCourseProgress()
 },[])
  return course ? (
    <>
      <div className='flex flex-wrap  justify-center gap-[50px] relative z-20 px-[20px]'>
        <div className='xs:max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl  flex flex-col items-center mt-[50px] px-[50px] '>
          <div className='flex flex-col items-start gap-5'>
            {course?.courseContent?.map((chapter, index) => (
              <div key={index} className='w-[370px] md:w-lg lg:w-xl' >
                <div className='flex justify-between items-center h-[50px] bg-[#F7F9FD] p-3 cursor-pointer' onClick={() => handleSections(index)}>
                  <div className='flex gap-2 text-[16px]'>
                    <img src={assets.down_arrow_icon} alt="down-arrow-icon" className={`${hideSections[index] ? '' : 'rotate-180'}`} />
                    <p className='text-xs sm:text-sm md:text-md lg:text-lg'>{chapter.chapterTitle}</p>
                  </div>
                  <div className='flex text-[14px]'>
                    <p className='text-xs sm:text-sm md:text-md lg:text-lg'>{chapter.chapterContent.length}</p>
                    <p className='text-xs sm:text-sm md:text-md lg:text-lg'>{totalChapterTime(chapter)}</p>
                  </div>
                </div>
                <div className={`flex flex-col p-2 gap-2 transition-all ease-in-out duration-500 ${hideSections[index] ? 'hidden' : ''}`}>
                  {chapter.chapterContent.map((lecture, index) => {
                    return <div className='flex justify-between pl-[40px] pr-[20px]' key={index} >
                      <div className='flex gap-2  text-gray-800 text-xs sm:text-sm md:text-md lg:text-lg'>
                        <img src={progressData && progressData.lectureCompleted.includes(lecture.lectureId) ? assets.blue_tick_icon : assets.play_icon} alt="play-video-icon" />
                        {lecture.lectureTitle}
                      </div>
                      <div className='flex gap-2 items-center'>
                        <p className='text-[15px] text-blue-600 cursor-pointer' onClick={() => setPlayer({ lectureId:lecture.lectureId ,videoId: lecture.lectureUrl.split('/').pop(), name: lecture.lectureTitle })}>Play</p>
                        <p className='text-[14px]'>{humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ["h", "m"] })}</p>
                      </div>
                    </div>
                  })}
                </div>
              </div>
            ))}
            <div className='flex items-center gap-2 py-3 mt-10'>
              <p className='text-sm  md:text-md lg:text-xl font-bold'>Rate this course:</p>
              <Rating initialRating={initialRating} onrate={handleRate} />
            </div>
          </div>
        </div>
        <div className='mt-[50px]'>
          {
            player ? <Youtube videoId={player.videoId} iframeClassName='w-[370px] sm:w-[424px] h-[260px] aspect-video' /> : <img src={course.courseThumbnail} alt="course-courseThumbnail" className='w-[424px] h-[220px]' />
          }
          <div className='flex justify-between'>
            <p className='text-gray-500'>{player?.name}</p>
            {player.lectureId && <button  onClick={() => markLectureAsCompleted(player?.lectureId)} className='text-blue-600 cursor-pointer'>{progressData && progressData.lectureCompleted.includes(player.lectureId) ? 'Completed' : 'Mark complete'}</button>}
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) : <Loading />
}

export default Player
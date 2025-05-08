import React, { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { appContext } from '../../AppContext/AppContext'
import { useEffect } from 'react'
import { assets } from '../../assets/assets/assets'
import Loading from '../../components/student/Loading'
import humanizeDuration from 'humanize-duration'
import Footer from '../../components/student/Footer'
import Youtube from 'react-youtube'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useUser } from '@clerk/clerk-react'
const CourseDetalis = () => {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [hideSections, setHideSections] = useState({})
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false)
  const [player, setPlayer] = useState(null)
  const { averageRating, TotalNumberOfLectures, totalDurationTime, totalChapterTime, backendUrl, userData, getToken } = useContext(appContext)
  const { user } = useUser()
  console.log(user);



  const handleSections = (index) => {
    setHideSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }
  const fetchCourseData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/course/' + id)
      console.log(data);

      if (data.success) {
        setCourse(data.courseData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const enrollCourse = async () => {
    try {
      if (!userData) {
        return toast.warn('Login to enroll')
      }
      if (isAlreadyEnrolled) {
        return toast.warn("Alreadt enrolled")
      }
      const token = await getToken()
      const { data } = await axios.post(backendUrl + '/api/user/purchase', { courseId: course._id }, { headers: { Authorization: `Bearer ${token}` } })
      if (data.success) {
        const { session_url } = data
        window.location.replace(session_url, '/my-enrollments')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchCourseData()
  }, [id])
  useEffect(() => {
    if (userData && course) {
      setIsAlreadyEnrolled(userData?.enrolledCourses?.includes(course._id))
    }
  }, [userData, course])
  if (!course) {
    return <Loading />
  }

  return (
    <>
      <div className='flex flex-col lg:flex-row gap-[100px] relative z-20'>
        <div className='absolute left-0 right-0 h-[600px] top-0 bg-gradient-to-b from-cyan-400/20 to-white -z-1'></div>
        <div className='max-w-2xl flex flex-colm items-start mt-[50px] px-[50px] ml-[40px]'>
          <div className='flex flex-col items-start gap-5'>
            <h1 className='text-[40px] text-gray-800 font-semibold'>Build Text to image SaaS App in React JS</h1>
            <p className='text-gray-500 text-[16px] font-normal'>Master MERN Stack by building a Full Stack AI Text to Image SaaS App using React js,
              Mongodb, Node js, Express js and Stripe Payment</p>
            <div className='flex items-center gap-2'>
              <p className='text-[14px]'>{averageRating(course)}</p>
              <div className='flex'>
                {[...Array(5)].map((_, i) => (<img src={i < averageRating(course) ? assets.star : assets.star_blank}
                  className='w-[15px] h-[15px]' alt="star" key={i} />))}
              </div>
              <p className='text-blue-600 text-[14px]'>{course.courseRatings.length}({course.courseRatings.length > 1 ? 'Ratings' : 'rating'})</p>
              <p className='text-[14px] text-gray-500'>{course?.enrolledStudents?.length}  {course.enrolledStudents?.length > 1 ? 'Students' : 'student'}</p>
            </div>
            <p className='text-gray-800 text-sm'>Course By <span className='text-blue-600 underline'>{course?.educator?.name}</span></p>
            <div className='flex flex-col text-start w-full'>
              <p className='text-[20px] text-gray-800 font-semibold'>Course Structure</p>
              <p className='mt-[10px]'>{course.courseContent?.length + " sections - " + TotalNumberOfLectures(course)
                + " Lectures - " + totalDurationTime(course) + " total duration"}</p>
              <div className='flex flex-col mt-[20px]'>
                {course?.courseContent?.map((chapter, index) => (
                  <div key={index} >
                    <div className='flex justify-between items-center h-[50px] bg-[#F7F9FD] p-3 cursor-pointer' onClick={() => handleSections(index)}>
                      <div className='flex gap-2 text-[16px]'>
                        <img src={assets.down_arrow_icon} alt="down-arrow-icon" className={`${hideSections[index] ? '' : 'rotate-180'}`} />
                        <p>{chapter.chapterTitle}</p>
                      </div>
                      <div className='flex text-[14px]'>
                        <p>{chapter.chapterContent.length}</p>
                        <p>{totalChapterTime(chapter)}</p>
                      </div>
                    </div>
                    <div className={`flex flex-col p-2 gap-2 transition-all ease-in-out duration-500 ${hideSections[index] ? 'hidden' : ''}`}>
                      {chapter.chapterContent.map((lecture, index) => {
                        return <div className='flex justify-between pl-[40px] pr-[20px]' key={index}>
                          <div className='flex gap-2 text-[15px] text-gray-800'>
                            <img src={assets.play_icon} alt="play-video-icon" />
                            {lecture.lectureTitle}
                          </div>
                          <div className='flex gap-2 items-center'>
                            <p className='text-[15px] text-violet-600 cursor-pointer' onClick={() => setPlayer({ videoId: lecture.lectureUrl.split('/').pop() })}>{lecture.isPreviewFree ? 'Preview' : ''}</p>
                            <p className='text-[14px]'>{humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ["h", "m"] })}</p>
                          </div>
                        </div>
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className='flex flex-col gap-4 mt-[80px]'>
                <h1 className='text-[20px] text-gray-800'>Course Description</h1>
                <p className='text-[14px] text-gray-500'>This is the most comprehensive and in-depth JavaScript course with 30 JavaScript projects</p>
                <p className='text-[14px] text-gray-500'>JavaScript is currently the most popular programming language in the world.
                  If you are an aspiring web developer or full stack developer,
                  JavaScript is a must to learn. It also helps you to get high-paying jobs all over the world.</p>
              </div>
            </div>
          </div>
        </div>
        <div className='mt-[50px] pl-20 lg:pl-0'>
          {
            player ? <Youtube videoId={player.videoId} opts={{ playerVars: { autoplay: 1 } }} iframeClassName='w-[424px] h-[260px] aspect-video' /> : <img src={course.courseThumbnail} alt="course-courseThumbnail" className='w-[424px]' />
          }
          <div className='p-4 '>
            <p className='flex text-red-500 text-[16px] gap-2'><img src={assets.time_left_clock_icon} alt="time_clock_icon"
            />5 days left at this price!</p>
            {course.discount ? <p className='flex items-center gap-4 mt-[20px]'> <span className='text-[34px] font-semibold'>
              ${(course.coursePrice - course.coursePrice * course.discount / 100).toFixed(2)}</span>
              <span className='text-[18px] text-gray-500'>${course.coursePrice}</span>
              <span className='text-[18px] text-gray-500'>{course.discount}%off</span></p> : course.coursePrice}
            <div className='flex gap-5 mt-[20px]'>
              <div className='flex gap-2'><img src={assets.star} alt="star" />{course?.courseRatings[0]?.rating}</div> |
              <div className='flex gap-2 text-gray-500'><img src={assets.time_clock_icon} alt="" />{totalDurationTime(course)}
                <span className='text-black'></span></div> |
              <div className='flex gap-2 text-gray-500'><img src={assets.lesson_icon} alt="lesson" />{TotalNumberOfLectures(course)}</div>
            </div>
            {user && course.educator._id === user.id ? (
              <></>
            ) : (
              <button
                onClick={enrollCourse}
                className="h-[48px] w-[400px] lg:w-full text-white bg-[#4B7BFF] text-[16px] mt-[20px]"
              >
                {isAlreadyEnrolled ? 'Already enrolled' : 'Enroll now'}
              </button>
            )}
            <h1 className='text-[18px] font-medium text-gray-800 mt-[20px]'>What’s in the course?</h1>
            <ul className='text-gray-500 flex flex-col mt-[10px]'>
              <li>. Lifetime access with free updates.</li>
              <li>. Step-by-step, hands-on project guidance.</li>
              <li>. Downloadable resources and source code.</li>
              <li>. Quizzes to test your knowledge.</li>
              <li>. Certificate of completion.</li>
              <li>. Quizzes to test your knowledge.</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default CourseDetalis
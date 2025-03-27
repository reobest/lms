import React, { useContext, useEffect, useState } from 'react'
import { assets, dummyCourses } from '../../assets/assets/assets'
import humanizeDuration from 'humanize-duration'
import { appContext } from '../../AppContext/AppContext'
import Loading from '../../components/student/Loading'
import { useParams } from 'react-router-dom'
import Youtube from 'react-youtube'
import Footer from '../../components/student/Footer'
import Rating from '../../components/student/Rating'
const Player = () => {
  const { courseId } = useParams()
  const [hideSections, setHideSections] = useState({})
  const [course, setCourse] = useState(null)
  const [player, setPlayer] = useState(null)
  console.log(player);

  const { totalChapterTime } = useContext(appContext)
  const handleSections = (index) => {
    setHideSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }
  useEffect(() => {
    const Course = dummyCourses.find((course) => course._id == courseId)
    setCourse(Course)
  }, [])
  if (!course) {
    return <Loading />
  }
  return (
    <>
      <div className='flex flex-col lg:flex-row items-center gap-[100px] relative z-20'>
        <div className='max-w-2xl flex flex-colm items-start mt-[50px] px-[50px] ml-[40px]'>
          <div className='flex flex-col items-start gap-5'>
            {course.courseContent.map((chapter, index) => (
              <div key={index} className='w-xl' >
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
                    return <div className='flex justify-between pl-[40px] pr-[20px]' key={index} >
                      <div className='flex gap-2 text-[15px] text-gray-800'>
                        <img src={assets.play_icon} alt="play-video-icon" />
                        {lecture.lectureTitle}
                      </div>
                      <div className='flex gap-2 items-center'>
                        <p className='text-[15px] text-blue-600 cursor-pointer' onClick={() => setPlayer({ videoId: lecture.lectureUrl.split('/').pop(), name: lecture.lectureTitle })}>Play</p>
                        <p className='text-[14px]'>{humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ["h", "m"] })}</p>
                      </div>
                    </div>
                  })}
                </div>
              </div>
            ))}
            <div className='flex items-center gap-2 py-3 mt-10'>
              <p className='text-xl font-bold'>Rate this course:</p>
              <Rating initailRating={0} />
            </div>
          </div>
        </div>
        <div className='mt-[50px]'>
          {
            player ? <Youtube videoId={player.videoId} iframeClassName='w-[424px] h-[260px] aspect-video' /> : <img src={course.courseThumbnail} alt="course-courseThumbnail" className='w-[424px]' />
          }
          <div className='flex justify-between'>
            <p className='text-gray-500'>{player?.name}</p>
            <p className='text-blue-600 cursor-pointer'>{false ? 'Mark complete' : 'Complete'}</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Player
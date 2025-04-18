import React, { useContext, useEffect, useState } from 'react'
import { appContext } from '../../AppContext/AppContext'
import { Line } from 'rc-progress';
import axios from 'axios';
import { toast } from 'react-toastify';
const MyEnrollments = () => {
  const [progressArray,setProgressArray] = useState([])
  const {totalDurationTime,navigate,enrolledCourses,fetchUserEnrolledCourses , getToken,backendUrl,TotalNumberOfLectures,userData } = useContext(appContext)
  const getCourseProgress = async () => {
    try {
      const token = await getToken()
      const tempProgressArray = await Promise.all(
        enrolledCourses.map(async (course) => {
          const {data} = await axios.post(`${backendUrl}/api/user/get-course-progress`,{courseId:course._id},{headers :{Authorization:`Bearer ${token}`} })
          let totalLectures = TotalNumberOfLectures(course)
          const lectureCompleted = data.progressData ? data.progressData.lectureCompleted.length : 0
          console.log(lectureCompleted);
          
          return {totalLectures,lectureCompleted}
        })
      )
      setProgressArray(tempProgressArray)
    } catch (error) {
      toast.error(error.message)
    }
  }
  console.log(progressArray);
  
  useEffect(() => {
    if(userData){
      fetchUserEnrolledCourses()
    }
  },[userData])
  useEffect(() => {
    if(enrolledCourses.length > 0){
      getCourseProgress()
    }
  },[enrolledCourses])
  return (
    <div className='md:px-36 px-8 pt-10 mt-[50px]'>
      <h1 className='text-2xl font-semibold'>My Enrollments</h1>
      <table className='md:table-auto table-fixed w-full overflow-hidden border-mt-10'> 
        <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden'>
          <tr>
            <td className='px-4 py-3 font-semibold truncate'>Course</td>
            <td className='px-4 py-3 font-semibold truncate'>Duration</td>
            <td className='px-4 py-3 font-semibold truncate'>Completed</td>
            <td className='px-4 py-3 font-semibold truncate'>Status</td>
          </tr>
        </thead>
        <tbody className='text-gray-700'>
          {enrolledCourses && enrolledCourses.map((course,index) => (
            <tr key={index} className='border-b border-gray-500/20'>
              <td className='md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3'>
                <img src={course.courseThumbnail} alt="course-img" className='w-14 sm:w-24 md:w-28 h-16' />
                <div className='flex-1'>
                  <p className='mb-1 max-sm:text-sm'>{course.courseTitle}</p>
                  <Line percent={progressArray[index] ? progressArray[index].lectureCompleted * 100  / progressArray[index].totalLectures : 0 } strokeWidth={2} strokeColor="oklch(0.77 0.13 233.74)" />
                </div>
              </td>
              <td className='px-4 py-3 max-sm:hidden'>
                {totalDurationTime(course)}
              </td>
              <td className='px-4 py-3 max-sm:hidden'>
                {progressArray[index] && `${progressArray[index].lectureCompleted} / ${progressArray[index].totalLectures}`} <span>Lectures</span>
              </td>
              <td className='px-4 py-3 max-sm:text-left'>
                <button onClick={() => navigate(`/player/${course._id}`)} className='px-3 sm:px-5 py-1.5 sm:py-2 bg-blue-600 max-sm:text-xs text-white cursor-pointer'>
                  {progressArray[index]?.lectureCompleted === progressArray[index]?.totalLectures ? 'Completed' : 'On going'}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MyEnrollments
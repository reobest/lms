import React, { useEffect, useState, useContext } from 'react'
import { appContext } from '../../AppContext/AppContext'
import Loading from '../../components/student/Loading'
import { toast } from 'react-toastify'
import axios from 'axios'

const MyCourses = () => {
  const { backendUrl, isEducator, getToken } = useContext(appContext)
  const [cources, setCources] = useState([])
  const fetchCources = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(backendUrl + '/api/educator/courses', { headers: { Authorization: `Bearer ${token}` } })
      data.success && setCources(data.courses)
    } catch (error) {
      toast.error(error.message)
    }
  }
  useEffect(() => {
    if (isEducator) {
      fetchCources()
    }
  }, [isEducator])
  return cources ? (
    <div className='min-h-screen flex flex-col items-start p-8 gap-4'>
      <h1 className='font-semibold text-xl'>My Cources</h1>
      <table className='w-4xl max-w-4xl mt-[50px]'>
        <thead>
          <tr className='border border-gray-400'>
            <td className='w-[50%] font-semibold py-4 pl-3'>All Cources</td>
            <td className='w-[20%] font-semibold'>Earnings</td>
            <td className='w-[15%] font-semibold '>Students</td>
            <td className='w-[15%] font-semibold'>Published On</td>
          </tr>
        </thead>
        <tbody>
          {cources && cources?.map((course, index) => (
            <tr key={index} className='border border-t-white border-r-gray-400 border-l-gray-400 border-b-gray-400'>
              <td className='flex items-center gap-2  pl-3 py-4'>
                <img src={course.courseThumbnail} alt="course" className='w-16 h-10 rounded-bl-xs' />
                <p className='text-gray-700 text-small'>{course.courseTitle}</p>
              </td>
              <td>{course.enrolledStudents.length * (course.coursePrice - course.coursePrice * course.discount / 100).toFixed(3)}</td>
              <td className='text-gray-700 text-sm'>{course.enrolledStudents.length}</td>
              <td className='text-gray-700 text-sm'>{new Date().toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : <Loading />
}

export default MyCourses
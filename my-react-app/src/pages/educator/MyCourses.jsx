import React, { useEffect, useState } from 'react'
import { dummyCourses } from '../../assets/assets/assets'
import Loading from '../../components/student/Loading'

const MyCourses = () => {
  const [cources, setCources] = useState([])
  useEffect(() => {
    const fetchCources = () => {
      setCources(dummyCourses)
    }
    fetchCources()
  }, [])
  return cources ? (
    <div className='flex flex-col items-start p-8 gap-4'>
      <h1  className='font-semibold text-xl'>My Cources</h1>
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
                <td className='flex items-center gap-2 w-[50%] pl-3 py-4'>
                  <img src={course.courseThumbnail} alt="course" className='w-9 h-9' />
                  <p className='text-gray-700 text-small'>{course.courseTitle}</p>
                </td>
                <td className='w-[20%]'>{course.enrolledStudents.length *  (course.coursePrice - course.coursePrice * course.discount / 100).toFixed(3)}</td>
                <td className='text-gray-700 text-sm w-[15%]'>{course.enrolledStudents.length}</td>
                <td className='w-[15%] text-gray-700 text-sm'>{new Date().toLocaleDateString()}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  ) : <Loading />
}

export default MyCourses
import React, { useEffect, useState } from 'react'
import { dummyStudentEnrolled } from '../../assets/assets/assets'
import Loading from '../../components/student/Loading'

const StudentsEnrolled = () => {
  const [studentEnrolled, setStudentEnrolled] = useState([])
  useEffect(() => {
    const fetchCources = () => {
      setStudentEnrolled(dummyStudentEnrolled)
    }
    fetchCources()
  }, [])
  return studentEnrolled ? (
    <div className='flex items-start p-8 my-[50px] overflow-x-scroll hide-scrollbar'>
      <table className='w-4xl max-w-4xl mt-[50px]'>
        <thead>
          <tr className='border border-gray-400'>
            <td className='w-[10%] font-semibold py-4 pl-3'>#</td>
            <td className='w-[25%] font-semibold'>Student Name</td>
            <td className='w-[40%] font-semibold '>Courde Title</td>
            <td className='w-[25%] font-semibold'>Date</td>
          </tr>
        </thead>
        <tbody>
        {studentEnrolled && studentEnrolled?.map((student, index) => (
              <tr key={index} className='border border-t-white border-r-gray-400 border-l-gray-400 border-b-gray-400'>
                <td className='w-[10%] pl-3'>{index + 1}</td>
                <td className='flex items-center gap-2 w-[25%]  py-4'>
                  <img src={student.student.imageUrl} alt="student" className='w-9 h-9' />
                  <p className='text-gray-700 text-small'>{student.student.name}</p>
                </td>
                <td className='text-gray-700 text-sm w-[40%]'>{student.courseTitle}</td>
                <td className='w-[25%] text-gray-700 text-sm'>{new Date(student.purchaseDate).toLocaleDateString()}</td>
              </tr>
            ))}
        </tbody>
      </table >
    </div>
  ) : <Loading />
}

export default StudentsEnrolled
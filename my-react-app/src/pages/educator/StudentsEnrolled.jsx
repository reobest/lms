import React, { useContext, useEffect, useState } from 'react'
import Loading from '../../components/student/Loading'
import { appContext } from '../../AppContext/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const StudentsEnrolled = () => {
  const { getToken, backendUrl,isEducator } = useContext(appContext)
  const [studentEnrolled, setStudentEnrolled] = useState([])
  const fetchCources = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(backendUrl + '/api/educator/enrolled-students', { headers: { Authorization: `Bearer ${token}` } })
      if(data.success){
        setStudentEnrolled(data.enrolledStudents.reverse())
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  useEffect(() => {
    if(isEducator){
      fetchCources()
    } 
  }, [isEducator])
  return studentEnrolled ? (
    <div className='min-h-screen flex items-start p-8 my-[50px] overflow-x-scroll hide-scrollbar'>
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
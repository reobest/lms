import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets/assets'
import { useEffect } from 'react'
import Loading from '../../components/student/Loading'
import { appContext } from '../../AppContext/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
const DashBoard = () => {
  const { getToken, backendUrl, isEducator } = useContext(appContext)
  const [dashboradData, setDashboradData] = useState([])
  const fetchDashboradData = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(backendUrl + '/api/educator/dashboard', { headers: { Authorization: `Bearer ${token}` } })
      console.log(data);
      if (data.success) {
        setDashboradData(data.dashboardData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (isEducator) {
      fetchDashboradData()
    }
  }, [isEducator])
  
  const imagesData = [
    { img: assets.patients_icon, id: 0, name: dashboradData.enrolledStudentsData?.length || 0, title: "Total enrollments" },
    { img: assets.appointments_icon, id: 1, name: dashboradData.totalCources, title: "Total cources" },
    { img: assets.earning_icon, id: 2, name: dashboradData.totalEarnings, title: "Total earnings" },
  ]
  return dashboradData ? (
    <div className='min-h-screen flex flex-col items-start  gap-8 p-4'>
      <div className='flex gap-8 p-6 h-[100px]'>
        {imagesData.map((data, index) => (
          <div key={index} className='flex items-center px-8 py-2 gap-4 border border-blue-500/60 h-[100px] rounded-md'>
            <img src={data.img} alt="image" className='w-[55px] h-[55px]' />
            <div className='flex flex-col gap-1'>
              <p>{data.name}</p>
              <p className='text-gray-500 text-[16px]'>{data.title}</p>
            </div>
          </div>
        ))}
      </div>
      <div className='p-6'>
        <table className='w-4xl max-w-4xl'>
          <thead className='border border-gray-400 gap-5'>
            <tr className='flex justify-start py-2 px-10'>
              <td className='w-[10%] font-semibold truncate'>#</td>
              <td className='w-[30%] font-semibold truncate'>Student name</td>
              <td className='w-[40%] font-semibold truncate'>Course title</td>
              <td className='w-[20%] font-semibold truncate'>Date</td>
            </tr>
          </thead>
          <tbody className=' gap-5'>
            {dashboradData && dashboradData?.enrolledStudentsData?.map((student, index) => (
              <tr key={index} className='flex items-center py-4 px-10 border border-t-white border-r-gray-400 border-l-gray-400 border-b-gray-400'>
                <td className='w-[10%]'>{index + 1}</td>
                <td className='flex items-center gap-2 w-[30%]'>
                  <img src={student.student.imageUrl} alt="student" className='w-9 h-9' />
                  <p className='text-gray-700 text-small'>{student.student.name}</p>
                </td>
                <td className='text-gray-700 text-sm w-[40%]'>{student.courseTitle}</td>
                <td className='w-[20%] text-gray-700 text-sm'>{new Date().toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : <Loading />
}

export default DashBoard
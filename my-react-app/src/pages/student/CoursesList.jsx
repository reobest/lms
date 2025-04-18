import React, { useContext, useEffect, useState } from 'react'
import Searchbar from '../../components/student/Searchbar'
import { assets } from '../../assets/assets/assets'
import CourseCard from '../../components/student/CourseCard'
import Footer from '../../components/student/Footer'
import { appContext } from '../../AppContext/AppContext'
import { useParams } from 'react-router-dom'
const CoursesList = () => {
  const {navigate,allCources} = useContext(appContext)
  const [courses, setCourses] = useState([])
  const { input } = useParams()
  useEffect(() => {
    if (input) {
      const filteredCourses = allCources.filter((course) => course.courseTitle.toLowerCase().includes(input.toLowerCase()))
      setCourses(filteredCourses)
    } else {
      setCourses(allCources)
    }
  }, [input,allCources])
  return (
    <div>
      <div className='flex flex-col gap-4 lg:gap-0 lg:flex-row items-center justify-between mt-[50px] px-[60px]'>
        <div >
          <h1 className='font-semibold text-gray-800 text-4xl'>Course list</h1>
          <p className='mt-2'><span className='text-blue-600 cursor-pointer' onClick={() => navigate('/')}>home</span><span className='text-gray-500'> / Course list</span></p>
        </div>
        <Searchbar data={input} />
      </div>
      {input && <p className='ml-[8vw] mt-[50px] flex items-center gap-2 text-gray-500 text-[15px]'>{input} 
            <img src={assets.cross_icon} alt="crosicon" className='w-[10px] h-[10px] cursor-pointer' onClick={() => navigate('/course-list')} /></p>}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center mt-[50px] gap-8 px-[100px]'>
        {courses && courses.map((course, index) => <CourseCard key={index} course={course} />)}
      </div>
      <Footer />
    </div>
  )
}

export default CoursesList
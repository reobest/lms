import React from 'react'
import CourseCard from './CourseCard'
import { dummyCourses } from '../../assets/assets/assets'
import { Link } from 'react-router-dom'
const CoursesSection = () => {
  return (
    <div className='text-center'>
      <h2 className='text-[20px] md:text-[30px] text-black'>Learn from the best</h2>
      <p className='text-gray-500 text-[16px] px-7'>Discover our top-rated courses across various categories. From coding and design to
        business<br/> and wellness, our courses are crafted to deliver results.</p>
      <div className='grid  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-[100px] justify-items-center'>
        {dummyCourses.slice(0, 4).map((course, index) => <CourseCard key={index} course={course} />)}
      </div>
      <Link to='/course-list' className='border border-gray-500/20 text-gray-500 p-3 w-[175px] h-[45px]' onClick={() => scroll(0,0)}>
        Show all courses
      </Link>
    </div>
  )
}

export default CoursesSection
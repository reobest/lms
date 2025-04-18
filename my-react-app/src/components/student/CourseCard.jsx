import React,{useContext} from 'react'
import { assets } from '../../assets/assets/assets'
import { Link } from 'react-router-dom'
import { appContext } from '../../AppContext/AppContext'
const CourseCard = ({course}) => {
  const {averageRating}  = useContext(appContext)
  return (
    <Link to={'/course/' + course._id} onClick={() => scrollTo({ top: 0, behavior: "smooth" })} className={`border border-gray-500/20 rounded-md hover:scale-105 w-[350px]`}>
      <img src={course.courseThumbnail} alt="course-thumbnail" className=' h-[200px] rounded-t-md'/>
      <div className='text-start px-2 mt-4'>
        <h3>{course.courseTitle}</h3>
        <p className='text-gray-500'>{course?.educator?.name}</p>
        <div className='flex items-center gap-2'>
          <p className='text-[14px]'>{averageRating(course)}</p>
          <div className='flex'>
            {[...Array(5)].map((_,i) => ( <img src={i < averageRating(course) ? assets.star : assets.star_blank} className='w-[15px] h-[15px]' alt="star" key={i} /> ))}
          </div>
          <p className='text-gray-500'>{course.courseRatings.length}</p>
        </div>
        <p className='font-bold mb-2'>${(course.coursePrice - course.discount * course.coursePrice / 100).toFixed(2) }</p>
      </div>
    </Link>
  )
}

export default CourseCard
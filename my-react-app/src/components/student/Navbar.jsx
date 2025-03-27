import React,{useContext, useState} from 'react'
import { assets } from '../../assets/assets/assets'
import { Link } from 'react-router-dom'
import { UserButton, useUser, useClerk } from "@clerk/clerk-react"
import { appContext } from '../../AppContext/AppContext'
const Navbar = () => {
  const [isEducator,setIsEducator] = useState(true)
  const {navigate} = useContext(appContext)
  const { openSignIn } = useClerk()
  const { user } = useUser()
  const isCourseListPage = location.pathname.includes('/course-list')
  console.log(user?.firstName);
  
  return (
    <div className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 
    ${isCourseListPage ? 'bg-white' : 'bg-cyan-100/70'}`}>
      <img src={assets.logo} alt='logo' onClick={() => navigate('/')} className='w-28 lg:w-32 cursor-pointer' />
      <div className='hidden md:flex items-center gap-5 text-gray-500'>
      {user ?<div className='flex items-center gap-5'>
        <Link to='/educator'><button className='cursor-pointer'>{!isEducator ? 'Become Educator' : "Educator DashBoard"}</button></Link> |
            <Link to='/my-enrollments'>My Enrollmets</Link> 
        </div> : <></>}
        {user ? <UserButton /> : <button className='bg-blue-500 tetx-white px-5 py-2 rounded-full cursor-pointer outline-none text-white' onClick={() => openSignIn()}>Create Account</button>}
      </div>
      <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-500'>
        <div>
          {user &&  <Link to='/educator'><button className='cursor-pointer'>{!isEducator ? 'Become Educator' : "Educator DashBoard"}</button></Link> |
            <Link to='/my-enrollments'>My Enrollmets</Link>
          }
        </div>
        {user ? <UserButton /> : <button onClick={() => openSignIn()}><img src={assets.user_icon} alt='user-icon' /></button>}
      </div>
    </div>
  )
}

export default Navbar
import React, { useState } from 'react'
import { assets } from '../../assets/assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  const [isEducator, setIsEducator] = useState(true)
  const menuItems = [
    { name: "Dashboard", path: "/educator", icon: assets.home_icon },
    { name: "Add course", path: "/educator/add-course", icon: assets.add_icon },
    { name: "My Cources", path: "/educator/my-courses", icon: assets.my_course_icon },
    { name: "Students Enrolled", path: "/educator/student-enrolled", icon: assets.person_tick_icon },
  ]
  return isEducator && (
    <div className='md:w-64 w-16 border0-r min-h0screen text-base border-gray-500 py-2 flex flex-col'>
      {menuItems.map((item) => (
        <NavLink key={item} to={item.path} end={item.path === '/educator'}
          className={({ isActive }) => `flex items-center md:flex-row flex-col md:justify-start py-3.5 md:px-10 gap-3 
          ${isActive ? 'bg-indigo-50 border-r-[6px] border-blue-500/90' 
          : 'hover:bg-gray-100/90 border-r-[6px] border-white hover:border-blue-500/90'}`}>
          <img src={item.icon} alt="icon" className='w-6 h-6' />
          <p className='md:block hidden text-center'>{item.name}</p>
        </NavLink>
      ))}
    </div>
  )
}

export default Sidebar
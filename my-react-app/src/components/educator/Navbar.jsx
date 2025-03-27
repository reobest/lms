import React from 'react'
import { assets } from '../../assets/assets/assets'
import {  useUser , UserButton} from "@clerk/clerk-react"
const Navbar = () => {
    const { user } = useUser()
  return (
    <div className='flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3'>
      <img src={assets.logo} alt="logo" className='w-28 md:w-32' />
      <div className='flex items-center gap-5 text-gray-500 relative'>
        <p>Hi {user ? user.firstName : 'Developers'}</p>
        {user ? <UserButton/> : <img className='max-w-8' src={assets.profile_img} alt='profile'  />}
      </div>
    </div>
  )
}

export default Navbar
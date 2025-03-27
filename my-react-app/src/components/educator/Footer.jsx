import React from 'react'
import { assets } from '../../assets/assets/assets'

const Footer = () => {
  return (
    <footer className='flex flex-col md:flex-row items-center justify-between w-full px-16 py-8 gap-8 md:gap-0 border-t relatuve mb-0 h-[200px] '>
      <div className='flex items-center justify-center gap-2'>
        <a href='#'><img src={assets.facebook_icon} alt="facebook_icon" /></a>
        <a href='#'><img src={assets.twitter_icon} alt="twitter_icon" /></a>
        <a href='#'><img src={assets.instagram_icon} alt="instagram_icon" /></a>
      </div>
      <div className='flex items-center gap-4'>
        <img src={assets.logo} alt="logo" className='hiddenmd:block w-20' />
        <p className='text-xs text-gray-500 text-center md:text-sm'>All right reserved. Copyright @Edemy</p>
      </div>
    </footer>
  )
}

export default Footer
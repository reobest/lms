import React, { useContext } from 'react'
import { assets } from '../../assets/assets/assets'
import { appContext } from '../../AppContext/AppContext'
const Footer = () => {
  const { handleSubscribe,email,setEmail,isSubsribed} = useContext(appContext)
  
  
  return (
    <footer className='mt-[200px] flex flex-col items-center bg-[hsl(212,31%,10%)] w-full pt-5 gap-3'>
      {isSubsribed && <div className=' flex justify-center items-center absolute top-[80px] left-1/2 -translate-x-1/2 w-[250px] h-[45px]
       text-green-500/80 bg-white rounded-md text-[14px] font-medium p-2 '>Successfully subscribed</div>}
      <div className='flex flex-col md:flex-row gap-8 md:gap-[100px]'>
        <div className='flex flex-col items-center md:items-start gap-5 mt-6'>
          <img src={assets.logo_dark} alt="logo" className='w-[115px] h-[34px]' />
          <p className='test-center md:text-start text-white/80 text-[14px] font-light'>Lorem Ipsum is simply dummy text of the printing and <br />typesetting industry. Lorem Ipsum has been the <br />industry's standard dummy text.</p>
        </div>
        <div className='flex flex-col items-center md:items-start gap-8 mt-6'>
          <h3 className='text-white'>Componey</h3>
          <ul className='text-center md:text-start text-white/80 font-light cursor-pointer'>
            <li>Home</li>
            <li>About us</li>
            <li>Contact us</li>
            <li>Privacy policy</li>
          </ul>
        </div>
        <div className='flex flex-col items-center md:items-start gap-6 mt-6'>
          <h3 className='text-start text-[16px] text-white'>Subscribe to our newsletter</h3>
          <p className='text-center px-4 md:text-start text-[14px] text-white/80'>The latest news, articles, and resources, sent to your inbox weekly.</p>
          <div className='flex flex-col md:flex-row md:items-start items-center gap-3'>
            <input type="text" placeholder='Enter your email'
              className='placeholder-[#6B7280] text-[14px] text-white bg-[#1F2937] w-[260px] h-[38px] outline-none pl-3'
              onChange={(e) => setEmail(e.target.value)} value={email} />
            <button className='w-[97px] h-[38px] text-white text-[14px] bg-[#2563EB] cursor-pointer'
              onClick={handleSubscribe}>Subscribe</button></div>
        </div>
      </div>
      <hr className='text-white/80' />
      <p className='text-[15px] text-white/60 my-4 font-light'>Copyright 2024 © Edemy. All Right Reserved.</p>
    </footer>
  )
}

export default Footer
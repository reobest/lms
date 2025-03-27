import React , {useContext} from 'react'
import { assets } from '../../assets/assets/assets'
import { appContext } from '../../AppContext/AppContext'
const CallToAction = () => {
  const {navigate} = useContext(appContext)
  return (
    <div className='flex flex-col gap-4 items-center mt-[200px]'>
      <h1 className='text-[36px] font-bold text-black/80'>Learn anything, anytime, anywhere</h1>
      <p className='text-gray-500 text-[16px]'>Expand your knowledge with flexible, engaging courses designed to fit your schedule.achieve<br/> your goals with expert-led lessons 
        accessible anytime, anywhere</p>
        <div className='flex gap-5 mb-6'>
          <button className=' cursor-pointer hover:scale-105 bg-blue-600 text-white w-[140px] h-[42px] p-2 text-[14px]' onClick={() => navigate('/course-list')}>Get strated</button>
          <button className='flex items-center gap-1'>Learn more <img src={assets.arrow_icon} alt="arrow_icon" /></button>
        </div>
    </div>
  )
}

export default CallToAction
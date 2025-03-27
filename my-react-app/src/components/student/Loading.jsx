import React from 'react'
import { MoonLoader } from 'react-spinners';

const Loading = () => {
  return (
    <div className='w-[100vw] h-[100vh] flex justify-center items-center'>
      <MoonLoader
        color="#00ffff"
        size={60}
        speedMultiplier={2}
      />
    </div>
  )
}

export default Loading
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { MoonLoader } from 'react-spinners';

const Loading = () => {
  const {path} = useParams()
  const navigate = useNavigate()
  useEffect(() => {
    if(path){
      const timer = setTimeout(() => {
        navigate(`'${path}`)
      }, 5000);
      return () => clearTimeout(timer)
    }
  }, [])
  
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
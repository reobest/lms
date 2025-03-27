import React, { useState } from 'react'
import { assets } from '../../assets/assets/assets'
import { useNavigate } from 'react-router-dom'

const Searchbar = ({ data }) => {
  const [input, setInput] = useState(data ? data : '')
  const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault()
    navigate(`/course-list/${input}`)
  }
  return (
    <form className='max-w-xl w-full h-[54px] flex items-center  border border-gray-500/20 rounded px-2' onSubmit={handleSubmit}>
      <img src={assets.search_icon} alt="search-icon" className='' />
      <input
        type="text"
        placeholder='Search for courses'
        className='h-full w-full outline-none text-black text-start px-3'
        onChange={(e) => setInput(e.target.value)}
        value={input}
      />
      <button type='submit' className='w-[164px] h-[42px] bg-blue-600 text-white cursor-pointer'>Search</button>
    </form>
  )
}

export default Searchbar
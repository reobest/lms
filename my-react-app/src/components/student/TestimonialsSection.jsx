import React from 'react'
import { assets, dummyTestimonial } from '../../assets/assets/assets'

const TestimonialsSection = () => {
  return (
    <div className='mt-[40px]'>
      <h2 className='text-[30px] font-medium'>Testimonials</h2>
      <p className='text-gray-500 text-[16px] font-light px-4'>Hear from our learners as they share their journeys of transformation, success,
        and how our <br />platform has made a difference in their lives.</p>
      <div className='grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-[25px] gap-12 justify-items-center'>
        {dummyTestimonial.map((testimonial, i) => (
          <div key={i} className='flex flex-col w-[320px] h-[300px] rounded-md shadow-[0px_4px_15px_0px] shadow-black/5'>
            <div className='flex bg-gray-300/20 box-border p-2'>
              <img src={testimonial.image} alt={testimonial.name} className='h-12 w-12 rounded-full' />
              <div className='ml-5 text-start'>
                <h4 className='font-medium text-[18px]'>{testimonial.name}</h4>
                <p className='text-gray-500 text-sm'>{testimonial.role}</p>
              </div>
            </div>
            <div className='flex flex-col gap-3 items-start pt-6 pl-3'>
              <div className='flex'>
                {[...Array(5)].map((_, i) =>  <img src={i < testimonial.rating ? assets.star : assets.star_blank} alt='star' key={i} className='w-[15px] h-[15px]' /> )}
              </div>
              <p className='text-[14px] text-gray-500 text-start'>{testimonial.feedback}</p>
              <a href='#' className='text-blue-500'>Reed more</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TestimonialsSection
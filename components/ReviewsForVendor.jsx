import React from 'react'

const ReviewsForVendor = (props) => {
  return (
    <div className='p-4 sm:p-6 w-full max-w-full'>
    <h1 className='text-black font-semibold text-2xl sm:text-3xl pb-4 sm:pb-5'>Recent Reviews</h1>
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5'>
{Array.isArray(props.reviews) && props.reviews.length > 0 ? (
props.reviews.map((item) => (
 <div key={item._id} className='bg-green-500 p-3 sm:p-4 sm:py-3 rounded-2xl sm:rounded-3xl grid items-center hover:bg-green-600 transition-colors shadow-md'>
  <h3 className='text-white text-sm sm:text-base md:text-lg'>{item.msg}</h3>
  <p className='text-gray-100 text-xs sm:text-sm mt-2'>{item.name || "Anonymous"}</p>
 </div> 
))
) : (
<p>No reviews available</p>
)}
</div>
</div>
  )
}

export default ReviewsForVendor

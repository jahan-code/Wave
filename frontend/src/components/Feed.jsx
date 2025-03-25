import React from 'react'
import Posts from './Posts'

const Feed = () => {
  return (
    <div className='md:mx-0 md:my-0 mx-18 my-18 pt-[60px] pb-[60px]'>
        <Posts className='flex-1 my-8 flex flex-col items-center pl-[20%]'/>
    </div>
  )
}

export default Feed
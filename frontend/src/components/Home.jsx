import React from 'react'
import RightSidebar from './RightSidebar'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import useGetAllPost from '@/hooks/useGetAllPost'
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'

const Home = () => {
  useGetAllPost();
  useGetSuggestedUsers();
  
  return (
    <div className='flex'>
      {/* Main content area */}
      <div className='flex-grow w-full min-w-0'>  {/* Added min-w-0 for better responsive behavior */}
        <Feed/>
        <Outlet/>
      </div>
      
      <div className="hidden md:block md:min-w-[300px] lg:min-w-[350px]">  {/* Added minimum width */}
        <RightSidebar />
      </div>
    </div>
  )
}

export default Home
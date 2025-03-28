import React from 'react'
import RightSidebar from './RightSidebar'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import useGetAllPost from '@/hooks/useGetAllPost'
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'
import SuggestedUser from './SuggestedUser'

const Home = () => {
  useGetAllPost();
  useGetSuggestedUsers();
  
  return (
    <div className='flex'>
      {/* Main content area */}
      <div className='flex-grow w-full min-w-0'>
        <Feed/>
        
        
        
        
        <Outlet/>
      </div>
      
      
      <div className="hidden md:block md:min-w-[300px] lg:min-w-[350px]">
        <RightSidebar>
          <SuggestedUser/>
        </RightSidebar>
      </div>
    </div>
  )
}

export default Home
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import useFollowUnfollow from '@/hooks/useFollowUnfollow';
import './SuggestedUser.css';
const SuggestedUser = () => {
    const { suggestedUsers, user } = useSelector(store => store.auth);
    const { toggleFollowUnfollow } = useFollowUnfollow();
    const [showAllMobile, setShowAllMobile] = useState(false);
    
    const isFollowing = (suggestedUserId) => {
        return user?.following.includes(suggestedUserId);
    }

    const handleFollowUnfollow = (suggestedUserId) => {
        toggleFollowUnfollow(suggestedUserId);
    }

    return (
        <div className='my-10'>
            <div className='flex items-center text-sm space-x-4 px-4 md:px-0'>
                <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
                <span 
                    className='font-medium cursor-pointer' 
                    onClick={() => {
                        if (window.innerWidth < 768) {
                            setShowAllMobile(!showAllMobile);
                        }
                    }}
                >
                    See All
                </span>
            </div>
            
            {/* Mobile View */}
            <div className='md:hidden'>
                {showAllMobile ? (
                    <div className='flex overflow-x-auto gap-3 px-4 pb-4 mt-3 hide-scrollbar'>
                    {suggestedUsers.map((user) => (
                        <div 
                            key={user._id} 
                            className='flex-shrink-0 w-[136px] bg-white p-3 rounded-xl shadow-md'
                        >
                            <div className='flex flex-col items-center gap-2'>
                                <Link to={`/profile/${user?._id}`}>
                                    <Avatar className='h-12 w-12'>
                                        <AvatarImage src={user?.profilePicture} alt="profile_image" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div className='text-center'>
                                    <h1 className='font-semibold text-xs'>
                                        <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
                                    </h1>
                                    <span className='text-gray-600 text-[10px] line-clamp-2'>{user?.bio}</span>
                                </div>
                                <button
                                    className={`text-xs font-bold px-3 py-1 rounded-full w-full 
                                        ${isFollowing(user._id) 
                                            ? 'bg-gray-100 text-gray-600' 
                                            : 'bg-blue-100 text-[#3BADF8]'}`}
                                    onClick={() => handleFollowUnfollow(user._id)}
                                >
                                    {isFollowing(user._id) ? 'Unfollow' : 'Follow'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                ) : (
                    // Horizontal slider
                    <div className='flex overflow-x-auto gap-3 px-4 pb-4 mt-3 hide-scrollbar'>
                        {suggestedUsers.slice(0, 5).map((user) => (
                            <div 
                                key={user._id} 
                                className='flex-shrink-0 w-[136px] bg-white p-3 rounded-xl shadow-md'
                            >
                                <div className='flex flex-col items-center gap-2'>
                                    <Link to={`/profile/${user?._id}`}>
                                        <Avatar className='h-12 w-12'>
                                            <AvatarImage src={user?.profilePicture} alt="profile_image" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <div className='text-center'>
                                        <h1 className='font-semibold text-xs'>
                                            <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
                                        </h1>
                                        <span className='text-gray-600 text-[10px] line-clamp-2'>{user?.bio}</span>
                                    </div>
                                    <button
                                        className={`text-xs font-bold px-3 py-1 rounded-full w-full 
                                            ${isFollowing(user._id) 
                                                ? 'bg-gray-100 text-gray-600' 
                                                : 'bg-blue-100 text-[#3BADF8]'}`}
                                        onClick={() => handleFollowUnfollow(user._id)}
                                    >
                                        {isFollowing(user._id) ? 'Unfollow' : 'Follow'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Desktop View */}
            <div className='hidden md:block'>
                {suggestedUsers.map((user) => (
                    <div 
                        key={user._id} 
                        className='flex items-center justify-between my-5 p-0 bg-transparent'
                    >
                        {/* ... existing desktop structure ... */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SuggestedUser;


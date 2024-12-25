import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import useFollowUnfollow from '@/hooks/useFollowUnfollow';

const SuggestedUser = () => {
    const { suggestedUsers, user } = useSelector(store => store.auth);
    const { toggleFollowUnfollow } = useFollowUnfollow();
    
    // Helper function to check if the current user is following a suggested user
    const isFollowing = (suggestedUserId) => {
        return user?.following.includes(suggestedUserId);
    }

    const handleFollowUnfollow = (suggestedUserId) => {
        toggleFollowUnfollow(suggestedUserId);  // Calling the follow/unfollow function from the hook
    }

    return (
        <div className='my-10'>
            <div className='flex items-center text-sm space-x-4'>
                <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
                <span className='font-medium cursor-pointer'>See All</span>
            </div>
            {suggestedUsers.map((user) => (
                <div key={user._id} className='flex items-center justify-between my-5'>
                    <div className='flex items-center gap-2'>
                        <Link to={`/profile/${user?._id}`}>
                            <Avatar>
                                <AvatarImage src={user?.profilePicture} alt="profile_image" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </Link>
                        <div>
                            <h1 className='font-semibold text-sm'>
                                <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
                            </h1>
                            <span className='text-gray-600 text-sm'>{user?.bio}</span>
                        </div>
                    </div>
                    {/* Follow/Unfollow button */}
                    <button
                        className={`text-xs font-bold cursor-pointer ${isFollowing(user._id) ? 'text-gray-300' : 'text-[#3BADF8]'}`}
                        onClick={() => handleFollowUnfollow(user._id)}
                    >
                        {isFollowing(user._id) ? 'Unfollow' : 'Follow'}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default SuggestedUser;

import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import useFollowUnfollow from '@/hooks/useFollowUnfollow';

const SuggestedUser = () => {
    const { suggestedUsers, user } = useSelector(store => store.auth);
    const { toggleFollowUnfollow } = useFollowUnfollow();
    
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
                <span className='font-medium cursor-pointer'>See All</span>
            </div>
            <div className='md:block'>
                {suggestedUsers.map((user) => (
                    <div 
                        key={user._id} 
                        className='flex flex-col w-[160px] md:flex-row items-center justify-between my-3 p-4 md:p-0 bg-white rounded-xl shadow-md md:shadow-none md:bg-transparent md:my-5 mx-4 md:mx-0'
                    >
                        <div className='flex flex-col md:flex-row items-center gap-3'>
                            <Link to={`/profile/${user?._id}`}>
                                <Avatar className='h-14 w-14 md:h-10 md:w-10'>
                                    <AvatarImage src={user?.profilePicture} alt="profile_image" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </Link>
                            <div className='text-center md:text-left'>
                                <h1 className='font-semibold text-sm'>
                                    <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
                                </h1>
                                <span className='text-gray-600 text-xs md:text-sm block mt-1'>{user?.bio}</span>
                            </div>
                        </div>
                        <button
                            className={`mt-3 md:mt-0 text-xs font-bold px-4 py-2 rounded-full transition-colors
                                ${isFollowing(user._id) 
                                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                                    : 'bg-blue-100 text-[#3BADF8] hover:bg-blue-200'}
                                md:text-[#3BADF8] md:bg-transparent md:hover:bg-transparent md:px-0 md:py-0 md:rounded-none`}
                            onClick={() => handleFollowUnfollow(user._id)}
                        >
                            {isFollowing(user._id) ? 'Unfollow' : 'Follow'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SuggestedUser;
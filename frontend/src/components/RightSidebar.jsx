import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import SuggestedUser from './SuggestedUser';

const RightSidebar = () => {
  // Get user data from Redux store
  const { user } = useSelector((store) => store.auth);

  // Return early if `user` is null or undefined
  if (!user) {
    return (
      <div className="w-fit my-10 pr-32">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="https://via.placeholder.com/150" alt="default" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-sm">Guest</h1>
            <span className="text-gray-600 text-sm">No bio available</span>
          </div>
        </div>
        <SuggestedUser />
      </div>
    );
  }

  return (
    <div className="w-fit my-10 pr-32">
      <div className="flex items-center gap-2">
        <Link to={`/profile/${user?._id}`}>
          <Avatar>
            <AvatarImage
              src={user.profilePicture || 'https://via.placeholder.com/150'}
              alt="user_image"
            />
            <AvatarFallback>{user.username?.[0] || 'CN'}</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <h1 className="font-semibold text-sm">
            <Link to={`/profile/${user?._id}`}>{user.username}</Link>
          </h1>
          <span className="text-gray-600 text-sm">{user.bio}</span>
        </div>
      </div>
      <SuggestedUser />
    </div>
  );
};

export default RightSidebar;

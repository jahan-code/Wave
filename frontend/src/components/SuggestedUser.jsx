import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers"

const SuggestedUser = () => {
  const { suggestedUsers } = useGetSuggestedUsers()

  return (
    <div className="md:px-4 md:py-3 md:border md:rounded-xl md:shadow-sm">
      <div className="px-4 pt-3 pb-2 md:hidden">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-600">Suggested For You</h2>
          <button className="text-xs font-semibold text-black">See All</button>
        </div>
        
        <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
          {suggestedUsers?.map((user) => (
            <div 
              key={user._id}
              className="flex flex-col items-center space-y-2 min-w-[140px] flex-shrink-0"
            >
              {/* Profile Image with Instagram-style Ring */}
              <div className="p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600">
                <Avatar className="w-16 h-16 border-2 border-white">
                  <AvatarImage src={user.profilePicture} />
                  <AvatarFallback className="bg-gray-100">
                    {user.username[0]}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Username */}
              <p className="text-xs font-semibold text-center">
                {user.username.length > 10 
                  ? `${user.username.slice(0, 8)}...`
                  : user.username}
              </p>

              {/* Full Name */}
              <p className="text-xs text-gray-500 text-center">
                {user.fullName?.split(' ')[0]}
              </p>

              {/* Follow Button */}
              <button className="text-xs font-semibold text-blue-500 hover:text-blue-600">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Version (keep your existing desktop styling) */}
      <div className="hidden md:block space-y-4">
        {suggestedUsers?.map((user) => (
          <div 
            key={user._id}
            className="flex items-center justify-between p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.profilePicture} />
                <AvatarFallback>{user.username[0]}</AvatarFallback>
              </Avatar>
              
              <div>
                <p className="font-semibold text-sm">{user.username}</p>
                <p className="text-xs text-muted-foreground">{user.fullName}</p>
              </div>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs rounded-full px-4"
            >
              Follow
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SuggestedUser
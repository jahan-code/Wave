import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers"

const SuggestedUser = () => {
  const { suggestedUsers } = useGetSuggestedUsers()

  return (
    <div className="md:px-4 md:py-3 md:border md:rounded-xl md:shadow-sm">
      <h2 className="text-lg font-bold mb-3 md:mb-4 md:text-xl">Suggested For You</h2>
      
      {/* Mobile Horizontal Scroll */}
      <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide md:hidden">
        {suggestedUsers?.map((user) => (
          <div 
            key={user._id}
            className="flex flex-col items-center min-w-[150px] bg-background rounded-lg p-3 shadow-sm border flex-shrink-0"
          >
            <Avatar className="w-12 h-12 mb-2 md:w-14 md:h-14">
              <AvatarImage src={user.profilePicture} />
              <AvatarFallback>{user.username[0]}</AvatarFallback>
            </Avatar>
            
            <div className="text-center mb-3">
              <p className="font-semibold text-sm md:text-base">{user.username}</p>
              <p className="text-xs text-muted-foreground">{user.fullName}</p>
            </div>

            <Button 
              variant="outline" 
              className="w-full text-xs h-8 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 md:text-sm md:h-9"
            >
              Follow
            </Button>
          </div>
        ))}
      </div>

      {/* Desktop Vertical List */}
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
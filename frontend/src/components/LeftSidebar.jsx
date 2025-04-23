import { Home, Search, TrendingUp, MessageCircle, PlusSquare, Heart, LogOut } from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar'
import { toast } from 'sonner'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'
import CreatePost from './CreatePost'
import { setPosts } from '@/redux/postSlice'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

const LeftSidebar = () => {
  const { likeNotification } = useSelector(store => store.realTimeNotification)
  const { user } = useSelector(store => store.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef(null)

  const logoutHandler = async () => {
    try {
      const res = await axios.get('https://fine-jeniffer-codexspaces-178dc5b8.koyeb.app/api/v1/user/logout', { withCredentials: true })
      
      if (res.data.success) {
        dispatch(setAuthUser(null))
        dispatch(setPosts([]))
        navigate("/login")
        toast.success(res.data.message)
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  const handleProfileClick = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
      logoutHandler()
    } else {
      timeoutRef.current = setTimeout(() => {
        navigate(`/profile/${user?._id}`)
        timeoutRef.current = null
      }, 300)
    }
  }

  const sidebarHandler = (textType) => {
    if (textType === 'Logout') {
      logoutHandler()
    } else if (textType === 'Create') {
      setOpen(true)
    } else if (textType === 'Notifications') {
    
    } else if (textType === 'Messages') {
      navigate('/chat')
    } else if (textType === 'Home') {
      navigate('/')
    } else if (textType === 'Explore') {
     
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const sidebarItems = [
    { icon: <Home size={24} />, text: "Home" },
    { icon: <TrendingUp size={24} />, text: "Explore" },
    { icon: <PlusSquare size={24} />, text: "Create" },
    { 
      icon: <Heart size={24} />, 
      text: "Notifications",
      className: "hidden md:flex" 
    },
    { 
      icon: <MessageCircle size={24} />, 
      text: "Messages",
      className: "hidden md:flex" 
        },
    {
      icon: (
        <Avatar className="w-6 h-6 md:w-8 md:h-8">
          <AvatarImage src={user?.profilePicture} alt="@shadcn"/>
          <AvatarFallback>{user?.username[0]}</AvatarFallback>
        </Avatar>
      ),
      text: "profile"
    },
    { icon: <LogOut size={24} />, text: "Logout", className: "hidden md:flex" }
  ]

  return (
    <>
      {/* Mobile Top Navbar */}
      <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-background border-b z-50 flex items-center justify-between px-4">
        <h1 className="font-bold text-xl">Wave</h1>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/notifications')}
            className="relative"
          >
            <Heart size={24} />
            {likeNotification.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {likeNotification.length}
              </span>
            )}
          </button>
          <button onClick={() => navigate('/chat')}>
            <MessageCircle size={24} />
          </button>
        </div>
      </div>

      {/* Main Sidebar/Bottom Nav */}
      <div className="fixed bottom-0 left-0 w-full h-16 border-t bg-background md:fixed md:top-0 md:left-0 md:w-[16%] md:h-screen md:border-r z-50">
        <div className="flex flex-col h-full">
          <h1 className="hidden md:block my-8 pl-3 font-bold text-xl">Wave</h1>
          <div className="flex flex-row justify-around items-center h-full md:flex-col md:items-start md:justify-start">
            {sidebarItems.map((item, index) => (
              <div
                key={index}
                onClick={item.text === "profile" ? handleProfileClick : () => sidebarHandler(item.text)}
                className={`flex flex-col items-center gap-1 p-2 hover:bg-gray-100 cursor-pointer rounded-lg md:flex-row md:gap-3 md:p-3 md:my-3 md:w-full ${item.className || ''}`}
              >
                <div className="relative">
                <span>{item.text}</span>
                  {item.icon}
                  {/* Desktop notification badge */}
                  {item.text === "Notifications" && likeNotification.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          size="icon"
                          className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 hover:bg-red-600 text-xs md:bottom-6 md:left-6"
                        >
                          {likeNotification.length}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div>
                          {likeNotification.length === 0 ? (
                            <p>No new notification</p>
                          ) : (
                            likeNotification.map((notification) => (
                              <div key={notification.userId} className="flex items-center gap-2 my-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarImage src={notification.userDetails?.profilePicture} />
                                  <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <p className="text-sm">
                                  <span className="font-bold">{notification.userDetails?.username}</span> liked your post
                                </p>
                              </div>
                            ))
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
                
              </div>
            ))}
          </div>
        </div>
        <CreatePost open={open} setOpen={setOpen} />
      </div>
    </>
  )
}

export default LeftSidebar
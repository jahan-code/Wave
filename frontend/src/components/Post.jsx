import React, { useState } from 'react';
import { DialogContent, DialogTrigger } from '@radix-ui/react-dialog';
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import { Button } from './ui/button';
import {FaHeart, FaRegHeart } from 'react-icons/fa';

import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Dialog } from '@radix-ui/react-dialog';
import CommentDialog from './CommentDialog';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts,setSelectedPost } from '@/redux/postSlice';
import axios from 'axios';
import { toast } from 'sonner';

const Post = ({ post }) => {
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);

  const dispatch = useDispatch();
  
  const [liked, setLiked] = useState(post?.likes?.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post?.likes?.length || 0);
  const [comment,setComment]=useState(post.comments)
  
  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : '');
  };

  const deletePostHandler = async () => {
    try {
        const res = await axios.delete(`https://wave-liart.vercel.app/api/v1/post/delete/${post?._id}`, { withCredentials: true })
        if (res.data.success) {
            const updatedPostData = posts.filter((postItem) => postItem?._id !== post?._id);
            dispatch(setPosts(updatedPostData));
            
            toast.success(res.data.message);
        }
    } catch (error) {
        console.log(error);
        toast.error(error.response.data.messsage);
    }

  }
  const likeOrDislikeHandler = async () => {
    try {
      
      const action = liked ? 'dislike' : 'like';
      const res = await axios.get(
        `https://wave-liart.vercel.app/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);
        const updatedPostData=posts.map(
          p=>p._id===post._id?{
            ...p,
            likes:liked?p.likes.filter(id=>id!==user._id):[...p.likes,user._id]
          }:p
        )
        dispatch(setPosts(updatedPostData))
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to update like status');
    }
  };
  const commentHandler=async()=>{
    try{
        const res=await axios.post(`https://wave-liart.vercel.app/api/v1/post/${post._id}/comment`,{text},{
          headers:{
            'Content-Type':'application/json'
          },
          withCredentials:true
        });
        if(res.data.success){
          const updatedCommentData=[...comment,res.data.comment]
          setComment(updatedCommentData)
          const updatedPostData=posts.map(p=>
            p._id===post._id?{...p,comments:updatedCommentData}:p
          )
          dispatch(setPosts(updatedPostData))
          toast.success(res.data.message)
          setText("")
        }

        
    }
    catch(error)
    {
      console.log(error)
    }
  }
  const bookmarkHandler = async () => {
    try {
        const res = await axios.get(`https://wave-liart.vercel.app/api/v1/post/${post?._id}/bookmark`, {withCredentials:true});
        if(res.data.success){
            toast.success(res.data.message);
        }
    } catch (error) {
        console.log(error);
    }
}


  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={post.author?.profilePicture || 'https://via.placeholder.com/150'} alt={post.author?.username} />
            <AvatarFallback>{post.author?.username?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <h1>{post.author?.username}</h1>
          {user?._id === post?.author?._id}
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-center text-sm">
          {
                        post?.author?._id !== user?._id && <Button variant='ghost' className="cursor-pointer w-fit text-[#ED4956] font-bold">Unfollow</Button>
                        }
            <Button variant="ghost" className="cursor-pointer w-fit">
              Add to favourite
            </Button>
            {user && user?._id === post?.author?._id && (
              <Button onClick={deletePostHandler} variant="ghost" className="cursor-pointer w-fit">
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <img className="rounded-sm my-2 w-full aspect-square object-cover" src={post.image || 'https://via.placeholder.com/500'} alt="Post" />

      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3">
        {
                        liked ? <FaHeart onClick={likeOrDislikeHandler} size={'24'} className='cursor-pointer text-red-600' /> : <FaRegHeart onClick={likeOrDislikeHandler} size={'22px'} className='cursor-pointer hover:text-gray-600' />
                    }
          <MessageCircle onClick={() => {
            dispatch(setSelectedPost(post))
            setOpen(true)}
            } className="cursor-pointer hover:text-gray-600" />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark onClick={bookmarkHandler} className="cursor-pointer hover:text-gray-600" />
      </div>
      <span className="font-medium block mb-2">{postLike} likes</span>
      <p>
        <span className="font-medium mr-2">{post.author?.username}</span>
        {post.caption }
      </p>
      {
      comment.length>0 &&(
        <span  onClick={() => {
          dispatch(setSelectedPost(post))
          setOpen(true)}
          } className="cursor-pointer text-sm text-gray-400">
          View all {comment?.length } comments
        </span>
      )
    }
      <CommentDialog open={open} setOpen={setOpen} />
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={text}
          onChange={changeEventHandler}
          placeholder="Add a comment..."
          className="outline-none text-sm"
        />
        {text && <span onClick={commentHandler} className="text-[#3BADF8] cursor-pointer">Post</span>}
      </div>
    </div>
  )
}

export default Post;

import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'
import SuggestedUser from './SuggestedUser'

const Posts = () => {
  const { posts } = useSelector(store => store.post)

  return (
    <div>
      {/* Render first post followed by SuggestedUser on mobile */}
      {posts.length > 0 && (
        <>
          <Post key={posts[0]._id} post={posts[0]} />
          <div className="md:hidden px-2">
            <SuggestedUser />
          </div>
        </>
      )}
      
      {/* Render remaining posts */}
      {posts.slice(1).map(post => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  )
}

export default Posts

import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 

export const register=async(req,res)=>{
    try {
        const {username,email,password}=req.body;
      if(!username||!email||!password){
        return res.status(401).json({
          message:"Something is missing,Please check!",
          success:false
        })
      }
      const user=await User.findOne({email})
        if(user)
        {
          return res.status(401).json({
            message:"Try different email",
            success:"false"
          })
        }
        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            return res.status(401).json({
                message: "Username is already taken.",
                success: false
            });
        }

        const minLength = 8;
        const hasNumber = /[0-9]/;
        const hasSymbol = /[!@#$%^&*]/;

        if (password.length < minLength) {
            return res.status(401).json({
                message: `Password must be at least ${minLength} characters long.`,
                success: false
            });
        }

        if (!hasNumber.test(password)) {
            return res.status(401).json({
                message: "Password must include at least one number.",
                success: false
            });
        }

        if (!hasSymbol.test(password)) {
            return res.status(401).json({
                message: "Password must include at least one special character (e.g., !, @, #, $, %, ^, &, *).",
                success: false
            });
        }

        const hashedPassword=await bcrypt.hash(password,10);
        await User.create({
          username,
          email,
          password:hashedPassword,
        })
        
        return res.status(201).json({
          message:"Account created Successfully!",
          success:true,
        })
    } catch (error) {
      console.log(error)  
    }
}
export const login=async(req,res)=>{
  try {
    const {email,password}=req.body;
    if(!email||!password)
    {
      return res.status(401).json({
        message:"Something is missing, Please check!",
        success:false
      })
    }
    let user=await User.findOne({email}).populate("posts")
    if(!user){
      return res.status(401).json({
        message:"Invalid email or Password!",
        success:false,
      })

    }
    const isPasswordMatch= await bcrypt.compare(password,user.password)
    if(!isPasswordMatch)
    {
      return res.status(401).json({
        message:"Something is missing,Please check"
      })
    }
    const token=await jwt.sign({userId:user._id},process.env.SECRET_KEY,{expiresIn:'1d'})
    const populatedPost=await Promise.all(
      user.posts.map(async(postId)=>{
        const post=await Post.findById(postId)
        if(post.author.equals(user._id))
        {
          return post;
        }
        return null;
      })
    )
    user={
      _id:user._id,
      username:user.username,
      email:user.email,
      profilePicture:user.profilePicture,
      bio:user.bio,
      following:user.following,
      followers:user.followers,
      posts:populatedPost,
    }
    return res.cookie('token',token,{httpOnly:true,sameSite:'strict',maxAge:1*24*60*60*1000}).json({
      message:`Welcome Back ${user.username}`,
      success:true,
      user,
    })
  } catch (error) {
    console.log(error)
  }
}
export const logout=async(req,res)=>{
  try {
    return res.cookie("token","",{maxAge:0}).json({
      message:"logged Out Successfully!",
      success:true,
    })
  } catch (error) {
    console.log(error)
  }
}
export const getProfile=async(req,res)=>{
  try {
    const userId=req.params.id;
    let user=await User.findById(userId).populate({path:'posts',createdAt:-1}).populate("bookmarks");
    
    return res.status(201).json({
      user,
      success:true,
    })
  } catch (error) {
    console.log(error)
  }
}
export const editProfile = async (req, res) => {
  try {
      const userId = req.id;
      const { bio, gender } = req.body;
      const profilePicture = req.file;
      let cloudResponse;

      if (profilePicture) {
          const fileUri = getDataUri(profilePicture);
          cloudResponse = await cloudinary.uploader.upload(fileUri);
      }

      const user = await User.findById(userId).select('-password');
      if (!user) {
          return res.status(404).json({
              message: 'User not found.',
              success: false
          });
      };
      if (bio) user.bio = bio;
      if (gender) user.gender = gender;
      if (profilePicture) user.profilePicture = cloudResponse.secure_url;

      await user.save();

      return res.status(200).json({
        success: true,
        message: "Profile updated.",
        user
      });
      
  } catch (error) {
      console.log(error);
  }
};
export const getSuggestedUsers=async(req,res)=>{
  try {
    const suggestedUsers=await User.find({_id:{$ne:req.id}}).select('-password');
    if(!suggestedUsers){
      return res.status(400).json({
        message:'Currently do not have any users',
      })

    }
    return res.status(200).json({
      success:true,
      users:suggestedUsers,
    })
  } catch (error) {
    console.log(error)
  }
}
export const followOrUnfollow=async(req,res)=>{
  try {
    const followkrneWala=req.id;
    const jiskofollowkrunga=req.params.id;
    if(followkrneWala===jiskofollowkrunga){
      return res.status(400).json({
        message:'You cannot follow Or Unfollow yourself',
        success:false,
      })
    }
    const user=await User.findById(followkrneWala)
    const targetUser=await User.findById(jiskofollowkrunga)

    if(!user||!targetUser)
    {
      return res.status(400).json({
        message:"User not found!",
        success:false,
      })
    }
    const isFollowing=user.following.includes(jiskofollowkrunga);
    if(isFollowing)
    {
      await Promise.all([
        User.updateOne({_id:followkrneWala},{$pull:{following:jiskofollowkrunga}}),
        User.updateOne({_id:jiskofollowkrunga},{$pull:{followers:followkrneWala}})
      ])
      return res.status(200).json({message:"Unfollow Successfully!", success:true})
    }else
    {
      await Promise.all([
        User.updateOne({_id:followkrneWala},{$push:{following:jiskofollowkrunga}}),
        User.updateOne({_id:jiskofollowkrunga},{$push:{followers:followkrneWala}})
      ])
      return res.status(200).json({message:"Follow Successfully!", success:true})
    }
  } catch (error) {
    console.log(error)
  }
}
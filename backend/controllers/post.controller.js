import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment} from "../models/comment.model.js";
import {getReceiverSocketId,io} from '../socket/socket.js'
export const addNewPost = async (req, res) => {
    try {
        const caption = req.body.caption;
        const image = req.file; // The uploaded image from the request
        const authorId = req.id;

        // Check if an image was provided
        if (!image) {
            return res.status(401).json({
                message: "Image required!"
            });
        }

        // Optimize the image using sharp
        let optimizedImageBuffer;
        if (image.mimetype === "image/jpeg" || image.mimetype === "image/png" || image.mimetype === "image/gif") {
            optimizedImageBuffer = await sharp(image.buffer)
                .resize({ width: 800, height: 800, fit: "inside" })
                .toFormat('jpeg', { quality: 80 }) // Convert all formats to JPEG for uniformity
                .toBuffer();
        } else {
            // Handle other formats (e.g., PNG, GIF) without conversion
            optimizedImageBuffer = image.buffer;
        }

        // Convert image buffer to base64
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;

        // Upload the image to Cloudinary
        const cloudResponse = await cloudinary.uploader.upload(fileUri, {
            resource_type: 'image',  // Specify the type as 'image'
        });

        // Create a new post
        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId,
        });

        // Find the user and associate the post
        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }

        // Populate the author field and send the response
        await post.populate({ path: 'author', select: '-password' });

        return res.status(201).json({
            message: 'New post added',
            success: true,
            post,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error while adding the post",
            success: false,
        });
    }
};
export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilePicture' })
            .populate({
                path: 'comments',
                sort: { createdAt: -1 },
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            });
        return res.status(200).json({
            posts,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
};
export const getUserPost=async(req,res)=>{
    try {
        const authorId=req.id;
        const posts=await Post.find({author:authorId}).sort({createdAt:-1}).populate({
            path:'author',
            select:'username, profilePicture'
        })
        .populate({
            path:'comments',
            sort:{createdAt:-1},
            populate:{
                path:'author',
                select:'username,profilePicture'
            }
        })
        return res.json({
            posts,
            success:true
        })
    } catch (error) {
        console.log(error)
    }

}
export const likePost = async (req, res) => {
    try {
        const likeKrneWalaUserKiId = req.id;
        const postId = req.params.id; 
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found', success: false });

        // like logic started
        await post.updateOne({ $addToSet: { likes: likeKrneWalaUserKiId } });
        await post.save();

        // implement socket io for real time notification
        const user = await User.findById(likeKrneWalaUserKiId).select('username profilePicture');
         
        const postOwnerId = post.author.toString();
        if(postOwnerId !== likeKrneWalaUserKiId){
            // emit a notification event
            const notification = {
                type:'like',
                userId:likeKrneWalaUserKiId,
                userDetails:user,
                postId,
                message:'Your post was liked'
            }
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification', notification);
        }

        return res.status(200).json({message:'Post liked', success:true});
    } catch (error) {

    }
}
export const dislikePost = async (req, res) => {
    try {
        const likeKrneWalaUserKiId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found', success: false });

        // like logic started
        await post.updateOne({ $pull: { likes: likeKrneWalaUserKiId } });
        await post.save();

        // implement socket io for real time notification
        const user = await User.findById(likeKrneWalaUserKiId).select('username profilePicture');
        const postOwnerId = post.author.toString();
        if(postOwnerId !== likeKrneWalaUserKiId){
            // emit a notification event
            const notification = {
                type:'dislike',
                userId:likeKrneWalaUserKiId,
                userDetails:user,
                postId,
                message:'Your post was liked'
            }
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification', notification);
        }



        return res.status(200).json({message:'Post disliked', success:true});
    } catch (error) {

    }
}
export const addcomment=async(req,res)=>{
    try {
        const postId=req.params.id;
        const commentkrneWalaUserKiId=req.id;
        const {text}=req.body;
        const post=await Post.findById(postId);
        if(!text)return res.status(400).json({
            message:'text is Required!',
            success:false
        })
        const comment=await Comment.create({
            text,
            author:commentkrneWalaUserKiId,
            post:post
        })
        await comment.populate({
          path:'author',
          select:"username profilePicture"
        })
        post.comments.push(comment._id);
        await post.save();
        return res.status(201).json({
            message:'comments Added',
            comment,
            success:true,
        })
    } catch (error) {
        console.log(error)
    }
}
export const getCommentsOfPost=async(req,res)=>{
    try {
        const postId=req.params.id;
        const comments=await Comment.find({post:postId}).populate('author','username profilePicture');
        if(!comments){
            return res.status(404).json({
                message:'Comments not found for this post',
                success:false,
            })
        }
        return res.status(200).json({
            success:true,
            comments,
        })
    } catch (error) {
        console.log(error)
    }
}
export const deletePost=async(req,res)=>{
    try {
        const postId=req.params.id;
        const authorId=req.id;
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({
                message:"Post Not found",
                success:false,
            })

        }
        if(post.author.toString()!==authorId){
            return res.status(403).json({
                message:'Unauthorized'
            })
        }
        await Post.findByIdAndDelete(postId);
        let user=await User.findById(authorId);
        user.posts=user.posts.filter(id=>id.toString()!==postId)
        await user.save();
        await Comment.deleteMany({post:postId});
        return res.status(200).json({
            success:true,
            message:'Post deleted!'
        })
    } catch (error) {
        console.log(error)
    }
}
export const bookmarkPost=async(req,res)=>{
    try {
        const postId=req.params.id;
        const authorId=req.id;
        const post=await Post.findById(postId)
        if(!post)
        {
            return res.status(404).json({message:'Post not found',
                                        success:false,
        })
    }
    const user = await User.findById(authorId);
        if(user.bookmarks.includes(post._id)){
            await user.updateOne({$pull:{bookmarks:post._id}})
            await user.save();
            return res.status(200).json({
                type:'unsaved',
                message:'Post removed from bookmark',
                success:true
            })
        }
        else{
            await user.updateOne({$addToSet:{bookmarks:post._id}})
            await user.save();
            return res.status(200).json({
                type:'saved',
                message:'Post bookmark',
                success:true
            })
        }
    } catch (error) {
        console.log(error)
    }
}
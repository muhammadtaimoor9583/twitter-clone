import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary'

//models
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

export const getUserProfile = async (req, res) => {
    const { username } = req.params;
    try {
        const user=await User.findOne({username});
        if(!user){
            return res.status(404).json({error:'User not found'});
        }
        user.password=null;
        console.log(user);
        return res.status(200).json(user);
       
    } catch (error) {
        console.log('Error in getuserProfile controller', error.message);
        res.status(500).json({ error: "Internal server error" });
    }

}

export const followUnfollowUser = async (req, res) => {
    const { id } = req.params;
    try {
        const userToModify = await User.findById(id);
        const me = await User.findById(req.user._id);


        if (!userToModify) {
            res.status(404).json({ error: "User not found" });
        }
        if (id === me._id.toString()) {
            res.status(400).json({ error: "You cannot follow yourself" });
        }
        const isFollowing = me.followings.includes(id);
        if (isFollowing) {
            //Unfollow the user
            await User.findOneAndUpdate(userToModify._id, { $pull: { followers: me._id } });
            await User.findOneAndUpdate(me._id, { $pull: { followings: userToModify._id } });

            res.status(200).json({ message: "Unfollowed successfully" });
        }
        else {
            //follow the user
            await User.findOneAndUpdate(userToModify._id, { $push: { followers: me._id } });
            await User.findOneAndUpdate(me._id, { $push: { followings: userToModify._id } });

            //Send notification
            const notify = new Notification({
                from: me._id,
                to: userToModify._id,
                type: "follow",
            });
            await notify.save();
            res.status(200).json({ message: "Followed successfully" });

        }

    } catch (error) {
        console.log('Error in followUnfollowUser controller', error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getSuggestedUser=async (req,res)=>{
    const userId=req.user._id;
    const userFollowedByMe=await User.findById(userId).select("followings");
    const users=await User.aggregate([
        {$match:{
            _id:{$ne:userId}
        }},{
            $sample:{size:10}
        }
    ])

    const filteredUser=users.filter(user=>{return !userFollowedByMe.followings.includes(user._id)});
    const suggestedUsers=filteredUser.slice(0,4);
    suggestedUsers.forEach(user=>user.password=null);
    res.status(200).json(suggestedUsers);
    
}

export const updateUser = async (req, res) => {
    const { fullname, email, username, currentPassword, newPassword, link, bio } = req.body;
    let { profileImg, coverImg } = req.body;

    const userId = req.user._id;
    try {
        let user = await User.findById(userId);
        let hashedPassword='';
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if ((currentPassword && !newPassword) || (newPassword && !currentPassword)) {
            return res.status(400).json({ message: 'Please provide both current and new password' });
        }
        if ((currentPassword && newPassword)) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Incorrect current password' });
            }
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(newPassword, salt);
        }


        if (profileImg) {
            if (user.profileImg) {
                await cloudinary.uploader.destroy(profileImg.split('/').pop().split('.')[0]);
            }
            const repondedUrl = await cloudinary.uploader.upload(profileImg);
            profileImg = repondedUrl.secure_url;
        }
        if (coverImg) {
            if (user.coverImg) {
                await cloudinary.uploader.destroy(coverImg.split('/').pop().split('.')[0]);
            }
            const repondedUrl = await cloudinary.uploader.upload(coverImg);
            coverImg = repondedUrl.secure_url;
        }

        //update user
        user.fullname = fullname || user.fullname;
        user.email = email || user.email;
        user.username = username || user.username;
        user.password = hashedPassword || user.password;
        user.link = link || user.link;
        user.bio = bio || user.bio;
        user.profileImg = profileImg || user.profileImg
        user.coverImg = coverImg || user.coverImg

        user = await user.save();
        user.password = null;
        res.json(user);

    } catch (error) {
        console.log('Error in Update Profile controller', error.message);
        res.status(500).json({ error: "Internal server error" });
    }


}
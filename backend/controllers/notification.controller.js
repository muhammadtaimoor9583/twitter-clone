import Notification from "../models/notification.model";

export const getAllNotification = async (req, res) => {
    const userId = req.user._id;
    try {
        const notifications = await Notification.find({ to: userId })
            .populate({
                path: 'from',
                select: 'username profileImg'
            })
            .sort({ createdAt: -1 });
        await Notification.updateMany({ to: userId }, { read: true });
        res.status(200).json(notifications);

    } catch (error) {
        console.log("Error in getAllNotifications controller", error.message);
        res.status(500).json({ message: "Internal Server Error" })

    }
}

export const deleteAllNotification = async (req, res) => {
    const userId = req.user._id;
    try {
        await Notification.deleteMany({to:userId});
        res.status(200).json({message:'Notification deleted succesfully'});

    } catch (error) {
        console.log("Error in deleteAllNotifications controller", error.message);
        res.status(500).json({ message: "Internal Server Error" })

    }
}

export const deleteNotification = async (req, res) => { 
    const userId = req.user._id;
    const notificationId = req.params.id;
    try {
        const notification=await Notification.findById(notificationId);
        if(!notification){
            return res.status(404).json({message:'Notification not found'});
        }
        if(notification.to.toString()!==userId){
            return res.status(401).json({message:'Unauthorized'});
            }
            await notification.remove();
    } catch (error) {
        console.log("Error in deleteNotifications controller", error.message);
        res.status(500).json({ message: "Internal Server Error" })
        
    }
}
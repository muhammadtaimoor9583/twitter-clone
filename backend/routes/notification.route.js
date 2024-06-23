import express from 'express';
import { protectRoute } from '../middleware/protectedRoute.js';
import {getAllNotification,deleteAllNotification,deleteNotification} from '../controllers/notification.controller.js'
const router=express.Router();


router.get('/',protectRoute,getAllNotification);
router.delete('/',protectRoute,deleteAllNotification);
router.delete('/:id',protectRoute,deleteNotification)

export default router;
import express from 'express';
import { protectRoute } from '../middleware/protectedRoute';
const router=express.Router();


router.get('/',protectRoute,getAllNotification);
router.delete('/',protectRoute,deleteAllNotification);
router.delete('/:id',protectRoute,deleteNotification)

export default router;
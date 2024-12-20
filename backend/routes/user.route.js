import express from "express";
import { getFavourites, addToFavourites, removeFromFavourites, suggestContent, addToFriends } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
const router = express.Router();

router.get('/favourites/:uname', getFavourites);
router.post('/favourites/', protectRoute, addToFavourites);
router.post('/share/', protectRoute, suggestContent);
router.delete('/favourites/:id', protectRoute, removeFromFavourites)


router.post('/friend/', addToFriends)
export default router;
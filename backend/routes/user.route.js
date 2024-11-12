import express from "express";
import { getFavourites, addToFavourites, removeFromFavourites } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
const router = express.Router();

router.get('/favourites/:uname', getFavourites);
router.post('/favourites/', protectRoute, addToFavourites);
router.delete('/favourites/:id',protectRoute,removeFromFavourites)
export default router;
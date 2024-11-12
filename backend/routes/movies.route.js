import express from "express";
import { getTrendingMovie ,getMovieTrailer,
    getMovieDetails,getSimiliarMovies,getCategoryMovies} from "../controllers/movies.controller.js";
const router = express.Router();

router.get("/trending",getTrendingMovie);
router.get("/:id/trailers",getMovieTrailer);
router.get("/:id/details",getMovieDetails);
router.get("/:id/similiar",getSimiliarMovies);
router.get("/category/:category",getCategoryMovies);
export default router;
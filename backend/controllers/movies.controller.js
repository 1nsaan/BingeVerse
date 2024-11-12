
import { fetchFromTMDB } from "../services/tmdb.service.js";


export async function getTrendingMovie(req, res) {
    try {
        // Fetch trending movies from TMDB
        const data = await fetchFromTMDB('https://api.themoviedb.org/3/trending/movie/day?language=en-US');

        // Check if the results array is not empty
        if (!data.results || data.results.length === 0) {
            return res.status(404).json({ success: false, message: "No trending movies found" });
        }

        // Pick a random movie from the results
        const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];

        // Respond with the random movie
        return res.status(200).json({ success: true, content: randomMovie });

    } catch (error) {
        // Log the error and send a server error response
        console.error('Error fetching trending movie:', error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


export async function getMovieTrailer(req, res) {
    try {
        const { id } = req.params;
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`);
        res.json({ success: true, trailers: data.results });
    } catch (error) {
        if (error.message.includes("404")) res.send(null);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export async function getMovieDetails(req, res) {

    const { id } = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}?language=en-US`);
        res.status(200).json({ success: true, content: data });
    } catch (error) {
        if (error.message.includes("404")) res.send(null);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


export async function getSimiliarMovies(req,res) {
    const {id} = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/similar?language=en-US`)
        res.status(200).json({ success: true, similiar: data.results });
    } catch (error) {
        if (error.message.includes("404")) res.send(null);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export async function getCategoryMovies(req,res) {
    const { category } = req.params;
	try {
		const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${category}?language=en-US`);
		res.status(200).json({ success: true, content: data.results });
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal Server Error" });
	} 
}
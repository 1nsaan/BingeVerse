import { create } from "zustand";
import axios from "axios";
export const useContentStore = create((set) => ({
	contentType: "movies",
	setContentType: (type) => set({ contentType: type }),
}));
export const useStore = create((set) => ({
	favourites: new Set(),

	initializeFavourites: (favouritesArray) => {
		set(() => {
			const initialFavourites = new Set(favouritesArray);
			return { favourites: initialFavourites };
		});
	},

	addFavourite: async (movieId) => {
		// Check if the favourite is already added to prevent unnecessary API calls
		set((state) => {
			if (!state.favourites.has(movieId)) {
				// If not, add the favourite and trigger the API call
				const updatedFavourites = new Set(state.favourites);
				updatedFavourites.add(movieId);
				return { favourites: updatedFavourites };
			}
			return state;  // No change, no need to update
		});

		// Make the API call only if the favourite was successfully added
		try {
			await axios.post('/api/v1/user/favourites/', { movieId });
			console.log("Favourite added successfully");
		} catch (error) {
			console.error("Failed to add favourite", error);
		}
	},

	removeFavourite: async (movieId) => {
		// Check if the favourite exists before attempting to remove it
		set((state) => {
			if (state.favourites.has(movieId)) {
				// If yes, remove it and trigger the API call
				const updatedFavourites = new Set(state.favourites);
				updatedFavourites.delete(movieId);
				return { favourites: updatedFavourites };
			}
			return state;  // No change, no need to update
		});

		// Make the API call only if the favourite was successfully removed
		try {
			await axios.delete(`/api/v1/user/favourites/${movieId}`);
			console.log("Favourite removed successfully");
		} catch (error) {
			console.error("Failed to remove favourite", error);
		}
	},
}));

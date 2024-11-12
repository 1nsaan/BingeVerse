import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast"; 

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
		set((state) => {
			if (!state.favourites.has(movieId)) {
				const updatedFavourites = new Set(state.favourites);
				updatedFavourites.add(movieId);
				return { favourites: updatedFavourites };
			}
			return state;
		});

		try {
			await axios.post('/api/v1/user/favourites/', { movieId });
			console.log("Favourite added successfully");
			toast.success("Added to favourites!");
		} catch (error) {
			console.error("Failed to add favourite", error);
			set((state) => {
				const updatedFavourites = new Set(state.favourites);
				updatedFavourites.delete(movieId);
				return { favourites: updatedFavourites };
			});
			toast.error("Error adding to favourites");
		}
	},

	removeFavourite: async (movieId) => {

		set((state) => {
			if (state.favourites.has(movieId)) {
				const updatedFavourites = new Set(state.favourites);
				updatedFavourites.delete(movieId);
				return { favourites: updatedFavourites };
			}
			return state;
		});

		try {

			await axios.delete(`/api/v1/user/favourites/${movieId}`);
			console.log("Favourite removed successfully");
			toast.success("Removed from favourites!");
		} catch (error) {
			console.error("Failed to remove favourite", error);

			set((state) => {
				const updatedFavourites = new Set(state.favourites);
				updatedFavourites.add(movieId);
				return { favourites: updatedFavourites };
			});
			toast.error("Error removing from favourites");
		}
	},

	handleAddToFavourites: async (movieId) => {
		const isFavourite = this.favourites.has(movieId);


		if (isFavourite) {
			await this.removeFavourite(movieId);
		} else {
			await this.addFavourite(movieId);
		}
	},
}));

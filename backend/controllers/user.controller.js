import User from "../models/user.model.js";

export async function getFavourites(req, res) {
  const { uname } = req.params;
  try {
    const userDetails = await User.findOne({ username: uname });
    return res.status(200).json({
      favourites: userDetails?.favourites
    });
  } catch (error) {
    console.error('Error fetching favourites:', error);
    return res.status(500).json({ message: 'Server error fetching fav', error });
  }

}


export async function addToFavourites(req, res) {
  const { user } = req;
  const { movieId } = req.body;
  const username = user.username;
  try {
    await User.updateOne({ username }, {
      $addToSet: {
        favourites: movieId
      }
    });
    return res.status(200).json({ success: "added successfully" });
  } catch (error) {
    console.error('Error fetching favourites in addToFavourites:', error);
    return res.status(500).json({ message: 'Server error fetching fav', error });
  }

}

export async function removeFromFavourites(req, res) {
  const { user } = req;  // Access the authenticated user from req.user
  const { id } = req.params;  // Extract movieId from the request body
  const username = user.username;
  try {
    // Use user._id instead of username to identify the user
    await User.updateOne(
      { username },  // Find the user by their _id
      { $pull: { favourites: id } }  // Remove movieId from favourites array
    );

    // Respond with a success message
    return res.status(200).json({ success: "removed successfully" });
  } catch (error) {
    console.error('Error fetching favourites in removeFromFavourites:', error);
    return res.status(500).json({ message: 'Server error fetching fav', error });
  }
}

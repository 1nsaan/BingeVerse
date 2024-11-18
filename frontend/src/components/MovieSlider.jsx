import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { useContentStore } from "../store/content";
import axios from "axios";
import { Link } from "react-router-dom";
import { SMALL_IMG_BASE_URL } from "../utils/constants";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useAuthStore } from "../store/authUser";
import toast from "react-hot-toast";
import { userStore } from "../store/content";

const MovieSlider = ({ category }) => {
  const { contentType } = useContentStore();
  const [content, setContent] = useState([]);
  const [showArrows, setShowArrows] = useState(false);
  const { user } = useAuthStore();
  const { favourites, initializeFavourites, addFavourite, removeFavourite } = userStore();
  const sliderRef = useRef(null);
  const formattedCategoryName =
    category.replaceAll("_", " ")[0].toUpperCase() + category.replaceAll("_", " ").slice(1);
  const formattedContentType = "Movies";
  useEffect(() => {
    // Initialize favourites when the user data is available
    if (user && user.favourites) {
      initializeFavourites(user.favourites);

    }
  }, [user, initializeFavourites]);

  const getContent = async () => {
    try {
      const res = await axios.get(`/api/v1/${contentType}/category/${category}`);
      setContent(res.data.content);
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };

  useLayoutEffect(() => {
    getContent();
  }, [contentType, category]);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -sliderRef.current.offsetWidth, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: sliderRef.current.offsetWidth, behavior: "smooth" });
    }
  };

  const handleAddToFavourites = async (movieId) => {
    const isFavourite = favourites.has(movieId);
    console.log(movieId + " " + isFavourite);
    if (isFavourite) {
      console.log("removing" + movieId);
      removeFavourite(movieId);
    } else {
      console.log("dding" + movieId);
      addFavourite(movieId);
    }
    console.log(favourites);

    try {
      const response = await axios.post(`/api/v1/user/favourites`, {
        uname: user.username,
        movieId,
      });

      if (response.status === 200) {
        toast.success(isFavourite ? "Removed from favourites!" : "Added to favourites!");
      }
    } catch (error) {
      toast.error("Error updating favourites");
      if (isFavourite) {
        addFavourite(movieId);
      } else {
        removeFavourite(movieId);
      }
    }
  };

  return (
    <div
      className="bg-black text-white relative px-5 md:px-20"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      <h2 className="mb-4 text-2xl font-bold">
        {formattedCategoryName} {formattedContentType}
      </h2>

      <div className="flex space-x-4 overflow-x-scroll scrollbar-hide" ref={sliderRef}>
        {content.map((item) => (
          <div className="min-w-[250px] relative group" key={item.id}>
            <Link to={`/watch/${item.id}`} className="rounded-lg overflow-hidden">
              <div className="rounded-lg overflow-hidden">
                <img
                  src={SMALL_IMG_BASE_URL + item.backdrop_path}
                  alt={item.title || item.name}
                  className="transition-transform duration-300 ease-in-out group-hover:scale-125"
                />
              </div>
            </Link>
            <p className="mt-2 text-center flex items-center justify-center space-x-2">
              <span>{item.title || item.name}</span>
              <Heart
                className={`text-white text-3xl ${favourites.has(item.title) ? "fill-current" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToFavourites(item.title);
                }}
              />
            </p>
          </div>
        ))}
      </div>

      {showArrows && (
        <>
          <button
            className="absolute top-1/2 -translate-y-1/2 left-5 md:left-24 flex items-center justify-center size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10"
            onClick={scrollLeft}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            className="absolute top-1/2 -translate-y-1/2 right-5 md:right-24 flex items-center justify-center size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10"
            onClick={scrollRight}
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
    </div>
  );
};

export default MovieSlider;

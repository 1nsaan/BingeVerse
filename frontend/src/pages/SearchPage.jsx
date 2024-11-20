import { useState } from "react";
import { useContentStore, userStore } from "../store/content";
import Navbar from "../components/Navbar";
import { Search } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import { Link } from "react-router-dom";

const SearchPage = () => {
  const [activeTab, setActiveTab] = useState("movie");
  const [searchTerm, setSearchTerm] = useState("");

  const [results, setResults] = useState([]);
  const [users, setUsers] = useState([]);
  const { setContentType } = useContentStore();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    tab === "movie" ? setContentType("movie") : setContentType("person");
    setResults([]);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`/api/v1/search/${activeTab}/${searchTerm}`);
      setResults(res.data.content);
      setUsers(res.data.users);
    } catch (error) {
      if (error.response.status === 404) {
        toast.error("Nothing found, make sure you are searching under the right category");
      } else {
        toast.error("An error occurred, please try again later");
      }
    }
  };

  const addToFriends = async (friendId)=>{
       
        try{
          const res = await axios.post('/api/v1/user/friend/',{friendId});
          toast.success("Added to Friends");
        }catch(error){
           console.log("Error adding to Friends",error);
           toast.error("Couldn't add. Please try again later");
        }
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center gap-3 mb-4">
          <button
            className={`py-2 px-4 rounded ${activeTab === "movie" ? "bg-red-600" : "bg-gray-800"} hover:bg-red-700`}
            onClick={() => handleTabClick("movie")}
          >
            Movies
          </button>
          <button
            className={`py-2 px-4 rounded ${activeTab === "person" ? "bg-red-600" : "bg-gray-800"} hover:bg-red-700`}
            onClick={() => handleTabClick("person")}
          >
            Person
          </button>
        </div>

        <form className="flex gap-2 items-stretch mb-8 max-w-2xl mx-auto" onSubmit={handleSearch}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={"Search for a " + activeTab}
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
          <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded">
            <Search className="size-6" />
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((result) => {
            if (!result.poster_path && !result.profile_path) return null;

            return (
              <div key={result.id} className="bg-gray-800 p-4 rounded">
                {activeTab === "person" ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={ORIGINAL_IMG_BASE_URL + result.profile_path}
                      alt={result.name}
                      className="max-h-96 rounded mx-auto"
                    />
                    <h2 className="mt-2 text-xl font-bold">{result.name}</h2>
                  </div>
                ) : (
                  <Link to={"/watch/" + result.id} onClick={() => setContentType(activeTab)}>
                    <img
                      src={ORIGINAL_IMG_BASE_URL + result.poster_path}
                      alt={result.title || result.name}
                      className="w-full h-auto rounded"
                    />
                    <h2 className="mt-2 text-xl font-bold">{result.title || result.name}</h2>
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* Users section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {users?.length > 0 && (
            <div className="mb-4 text-2xl font-semibold text-gray-300 text-center col-span-full">
              Users
            </div>
          )}

          {users?.map((user) => {
            return (
              <div key={user._id} className="bg-gray-800 p-4 rounded-lg flex flex-col items-center relative">
                {activeTab === "person" && (
                  <div >
                    <button className="absolute right-0 top-0 bg-red-600 px-2 py-2" onClick={(e)=>addToFriends(user.username)}>+</button>
                    <img
                      src={user.image}
                      alt={user.username}
                      className="max-h-96 w-32 h-32 object-cover mb-4"
                    />
                   
                    <h2 className="text-xl font-bold text-white">{user.username}</h2>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

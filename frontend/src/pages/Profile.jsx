import { useState } from 'react';
import { Heart } from 'lucide-react'; // Assuming you are using react-icons for heart icon
import { useAuthStore } from '../store/authUser';

const UserProfile = () => {
    const [activeTab, setActiveTab] = useState("favorites");
    const { user } = useAuthStore();
    return (
        <div className="bg-gray-100 min-h-screen py-8">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                <div className="flex items-center space-x-6">
                    <img
                        src={user.image} // Replace with actual profile image URL
                        alt="Profile Picture"
                        className="w-32 h-32 object-cover"
                    />
                    <div>
                        <h1 className="text-3xl font-bold">{user.username}</h1>
                        <p className="text-gray-600">{user.email}</p>
                        <div className="flex space-x-2 mt-4">
                            <button className="bg-blue-500 text-white py-2 px-4 rounded-full">Edit Profile</button>
                            <button className="bg-gray-300 text-gray-700 py-2 px-4 rounded-full">Log Out</button>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="mt-8 border-b">
                    <div className="flex space-x-8">

                        <button
                            className={`py-2 px-4 text-lg ${activeTab === "favorites" ? "border-b-4 border-blue-500" : "text-gray-600"}`}
                            onClick={() => setActiveTab("favorites")}
                        >
                            Favorites
                        </button>

                        <button
                            className={`py-2 px-4 text-lg ${activeTab === "settings" ? "border-b-4 border-blue-500" : "text-gray-600"}`}
                            onClick={() => setActiveTab("settings")}
                        >
                            Settings
                        </button>
                    </div>
                </div>


                {activeTab === "settings" && (
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold">Account Settings</h2>
                        <div className="space-y-4 mt-4">
                            <div className="flex justify-between items-center">
                                <label className="text-lg">Change Password</label>
                                <button className="bg-blue-500 text-white py-1 px-4 rounded-full">Change</button>
                            </div>
                            <div className="flex justify-between items-center">
                                <label className="text-lg">Update Email</label>
                                <button className="bg-blue-500 text-white py-1 px-4 rounded-full">Update</button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "favorites" && (
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold">Favorite Movies</h2>
                        <div className="mt-4">
                            {user.favourites.map((item) => (
                                <div className="relative flex items-center justify-between border p-2 mb-2" key={item.id}>
                                    <h4 className="flex-grow">{item}</h4>
                                    <div className="flex space-x-2">
                                        <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                                            Watch
                                        </button>
                                        <button
                                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                )}
            </div>
        </div >
    );
};

export default UserProfile;

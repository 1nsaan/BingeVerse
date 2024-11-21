import React, { useEffect, useState } from 'react';
import './ShareWithFriends.css'; 
import { useAuthStore } from "../store/authUser.js";
import {userStore} from "../store/content.js";
function ShareWithFriends({ movieId , movieTitle}) {
  const shareWithFriends = userStore().shareWithFriends;
  const [showFriends, setShowFriends] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [shareMessage, setShareMessage] = useState('');
  const friendsList = useAuthStore().user.friends;
  const handleShareClick = () => {
    setShowFriends(!showFriends);
    setShareMessage(''); 
  };

  const handleFriendSelection = (friend) => {
    if (selectedFriends.includes(friend)) {
      setSelectedFriends(selectedFriends.filter((f) => f !== friend));
    } else {
      setSelectedFriends([...selectedFriends, friend]);
    }
  };

  const handleShareConfirmation = async () => {

    
    if (selectedFriends.length > 0) {
      shareWithFriends(movieId, movieTitle,selectedFriends);
      setSelectedFriends([]);
      setShowFriends(false);
    } else {
      setShareMessage('Please select at least one friend to share.');
    }
  };

  const handleClearSelection = () => {
    setSelectedFriends([]);
    setShareMessage('');
    setShowFriends(false);
  };

  return (
    <div className="share-container">

      <button
        onClick={handleShareClick}
        className='mx-auto mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded '
      >
        Share
      </button>


      {showFriends && (
        <div className="red">
          <button className="clear-button " onClick={handleClearSelection}>
            X
          </button>
          <div className="friends-box">
            {friendsList.map((friend) => (
              <div key={friend} className="friend-item">
                <label>
                  <input
                    type="checkbox"
                    checked={selectedFriends.includes(friend)}
                    onChange={() => handleFriendSelection(friend)}
                  />
                  {friend}
                </label>
              </div>
            ))}
            <button className="confirm-button" onClick={handleShareConfirmation}>
             Suggest
            </button>
          </div>
        </div>
      )}

      {shareMessage && <div className="share-message">{shareMessage}</div>}
    </div>
  );
}

export default ShareWithFriends;
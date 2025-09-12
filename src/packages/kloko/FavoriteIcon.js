import React, { useContext } from "react";
import { Star as Favorite, StarFill as FavoriteFill } from "react-bootstrap-icons";
import  { useEvents } from "./context/useevents";


const FavoriteIcon = ({ event_id, favorite, style }) => {
  const { toggleFavorite } = useEvents();

  const handleClick = (e) => {
    e.stopPropagation();
    console.log("Toggle favorite for event:", event_id);
    if (toggleFavorite) {
      console.log("TOGGLE")
      toggleFavorite(event_id);
    }
  };

  return (
    <button
      type="button"
      className="btn btn-link p-0"
      aria-label={favorite === 1 ? "Unfavorite" : "Favorite"}
      style={style}
      onClick={handleClick}
      data-event-id={event_id}
    >
      {favorite === 1 ? (
        <FavoriteFill size={32} color="purple" />
      ) : (
        <Favorite size={32} color="purple" />
      )}
    </button>
  );
};

export default FavoriteIcon;

import React from "react";
import { useSelector } from "react-redux";
import "./css/count.css";

const CountRestaurant = () => {
  const { count, pureVegRestaurantsCount, showVegOnly, loading, error } =
    useSelector((state) => state.restaurants);

  return (
    <div>
      {loading ? (
        <p> Loading restaurant count...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <p className="NumOfRestro">
          {showVegOnly ? pureVegRestaurantsCount : count}
          <span className="Restro">
            {showVegOnly
              ? pureVegRestaurantsCount === 1
                ? " restaurant"
                : " restaurants"
              : count === 1
              ? " restaurant"
              : " restaurants"}
          </span>
        </p>
      )}
      <hr></hr>
    </div>
  );
};

export default CountRestaurant;

import React, { useState, useEffect, useContext } from 'react';
import { MainContext } from '../../contexts/MainContext.js';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from "react-router-dom";
import './Rider.css';



export const RiderPortal = () => {
  const { currentPage, setCurrentPage, selectedTrip, setSelectedTrip } = useContext(MainContext);
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const newLat = position.coords.latitude;
      const newLong = position.coords.longitude;
      setLat(newLat);
      setLong(newLong);
    })
  }, [])


  const containerStyle = {
    width: '400px',
    height: '400px'
  };

  const center = {
    lat: +lat,
    lng: +long
  };

  const handleClick = (e) => {
    setCurrentPage('riderSearch');

  }

  const handelHamburgerClick = () => {
    setCurrentPage("riderMenu");
  }


  return (
    <div className="rider-portal-container">

      <GiHamburgerMenu onClick={handelHamburgerClick} />

      <LoadScript
        googleMapsApiKey={process.env.MAPS_API_KEY}
      >
        <GoogleMap className="rider-map"
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          clickableIcons={true}
        >
          { /* Child components, such as markers, info windows, etc. */}
          <></>
        </GoogleMap>
      </LoadScript>

      <Link to="/riderSearch">
        <button onClick={handleClick}>New Ride</button>
      </Link>
    </div>
  );

}


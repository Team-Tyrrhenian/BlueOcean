import React, { useState, useEffect, useContext } from 'react';
import {MainContext} from '../../../../contexts/MainContext.js'



export const RiderUpcomingTrips = () => {
  const { currentPage, setCurrentPage, setUserId } = useContext(MainContext);

  return (
    <div>
      <div className='siteNavigatorSquare' onClick={() => { setCurrentPage('siteNavigator') }}> TO NAVIGATOR PAGE</div>
      <div className='siteNavigatorSquare' >
        This is {currentPage} make it more awesomer!!!
      </div>
    </div>
  );

}
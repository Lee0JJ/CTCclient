import { BigNumber, utils, ethers } from 'ethers';

export const daysLeft = (deadline) => {
  const difference = new Date(deadline * 1000) - Date.now();
  const remainingDays = difference / (1000 * 3600 * 24);

  return remainingDays.toFixed(0);
};

export const calculateBarPercentage = (goal, raisedAmount) => {
  const percentage = Math.round((raisedAmount * 100) / goal);

  return percentage;
};

export const checkIfImage = (url, callback) => {
  const img = new Image();
  img.src = url;

  if (img.complete) callback(true);

  img.onload = () => callback(true);
  img.onerror = () => callback(false);
};

export const calTotalAvailableTickets = (zoneInfo) => {
  let totalAvailableTickets = 0;

  try {
    for (let i = 0; i < zoneInfo.length; i++) {
      if (zoneInfo[i] && zoneInfo[i][1]) {
        totalAvailableTickets += parseInt(ethers.BigNumber.from(zoneInfo[i][1]));
      }
    }
  } catch (error) {
    console.error(error);
    return null;
  }

  return totalAvailableTickets;
};

export const calLowestTicketPrice = (zoneInfo) => {
  let lowestPrice = null;
  try {
    for (let i = 0; i < zoneInfo.length; i++) {
      const price = parseInt(ethers.BigNumber.from(zoneInfo[i][0]));
      if (lowestPrice === null || (price < lowestPrice 
        &&  parseInt(ethers.BigNumber.from(zoneInfo[i][1] > 0) ))) {
        lowestPrice = price;
      }
    }
  } catch (error) {
    console.error(error);
    return null;
  }
  return lowestPrice !== null ? lowestPrice + " ETH" : null;
};


import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context';
import { CountBox, CustomButton, Loader } from '../components';
import { directoryToJSON, calculateBarPercentage, daysLeft, calTotalAvailableTickets, calLowestTicketPrice } from '../utils';
import { thirdweb } from '../assets';

const CampaignDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { donate, getDonations, getAllTicket, getTicketSold, contract, address } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [ticketSold, setTicketSold] = useState([]);

  const remainingDays = daysLeft(state.date);

  const [images, setImages] = useState([]);

  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    async function fetchImages() {
      setImages(await directoryToJSON(state.image));
    }
    fetchImages();
  }, [state.image]);


  const fetchTickets = async () => {
    const data = await getAllTicket();
    const dataSold = await getTicketSold();
    //setTicketSold(dataSold.fliter((item) => item.campaignId === state.pId));
    setTicketSold(dataSold);
    //setTickets(data ? data.fliter((item) => item.campaignId === state.pId) : []);
  }

  useEffect(() => {
    if (contract) fetchTickets();
  }, [contract, address])

  const handleDonate = async () => {
    setIsLoading(true);

    await donate(state.pId, amount);

    navigate('/')
    setIsLoading(false);
  }

  //ZONE selection
  const [selectedZone, setSelectedZone] = useState(null);

  // Handle zone selection
  const handleZoneSelection = (zone) => {
    //console.log(state.zoneInfo[0][0]);
    setSelectedZone(zone);
  };

  //console.log("state", state);
  console.log(ticketSold)

  return (
    <div>
      {isLoading && <Loader />}

      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">
          <img src={images[0]} alt="campaign" className="w-full h-[410px] object-cover rounded-xl" />
          <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
            <div className="absolute h-full bg-[#4acd8d]" style={{ width: `${calculateBarPercentage(state.zoneInfo)}%`, maxWidth: '100%' }}>
            </div>
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          <CountBox title="Days Left" value={remainingDays} />
          <CountBox title="Tickets Left" value={calTotalAvailableTickets(state.zoneInfo)} />
          <CountBox title="Price From" value={calLowestTicketPrice(state.zoneInfo)} />
        </div>
      </div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Organizer</h4>

            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                <img src={thirdweb} alt="user" className="w-[60%] h-[60%] object-contain" />
              </div>
              <div>
                <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">{state.owner}</h4>
                <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]"></p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Description</h4>

            <div className="mt-[20px]">
              <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{state.description}</p>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Purchase History</h4>

            <div className="mt-[20px] flex flex-col gap-4">
              {ticketSold.length > 0 ? ticketSold.map((item, index) => (
                <div key={`${item.data.customerid}-${index}`} className="flex justify-between items-center gap-4">
                  <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll">{index + 1}. {item.data.owner}</p>
                  <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-ll">{new Date(item.data.time * 1000).toLocaleDateString()}</p>
                </div>
              )) : (
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">No purchase yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="">
          <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">ZONE</h4>

          {/* ZONE SELECTION */}
          <div>
            <div className="flex space-x-1">
              {state.zoneInfo.map((zone, index) => (
                <button
                  type='button'
                  key={index}
                  className="bg-blue-500 hover:bg-blue-700 w-max text-white font-bold py-2 px-4 rounded-full m-2"
                  onClick={() => handleZoneSelection(index)}
                  disabled={selectedZone !== null}
                >
                  Price: {zone.price}<br />
                  Available Seats: {zone.seatAmount}
                </button>
              ))}
            </div>
            {/* {selectedZone && (
              <p>You have selected Zone {selectedZone[0]} with {selectedZone[1]} available seats.</p>
            )} */}
          </div>
          {/* ZONE SELECTION */}

          {/* <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
            <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]">
              Fund the campaign
            </p>
            <div className="mt-[30px]">
              <input
                type="number"
                placeholder="Ticket Price"
                step="0.01"
                className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <input
                type="number"
                placeholder="Ticket Amount"
                step="0.01"
                className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">Back it because you believe in it.</h4>
                <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">Support the project for no reward, just because it speaks to you.</p>
              </div>

              <CustomButton
                btnType="button"
                title="Fund Campaign"
                styles="w-full bg-[#8c6dfd]"
                handleClick={handleDonate}
              />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default CampaignDetails
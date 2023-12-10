import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";
import FundCard from './FundCard';
import { loader } from '../assets';
import { useStateContext } from '../context';

const DisplayCampaigns = ({ title, isLoading, campaigns, editable }) => {
  const navigate = useNavigate();
  const { getCategory } = useStateContext();

  const handleNavigate = (campaign) => {
    if (editable) {
      navigate(`/edit-concert/${campaign.name}`, { state: campaign });
    } else {
      navigate(`/concert-details/${campaign.name}`, { state: campaign });
    }
  };

  const [filteredCampaigns, setFilteredCampaigns] = useState(campaigns);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    const fetchCategory = async () => {
      const data = await getCategory();
      setCategory(data);
      console.log(campaigns);
    };
    fetchCategory();
  }, []);

  useEffect(() => {
    const filteredConcert = categoryIndex === 0
      ? campaigns
      : campaigns.filter(campaign => campaign.category.includes(category[categoryIndex]?.categoryname));
    setFilteredCampaigns(filteredConcert);
    console.log(filteredConcert);
  }, [categoryIndex, category, campaigns]);

  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">{title} ({campaigns.length})</h1>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
        )}

        {!isLoading && campaigns.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            No concerts created yet
          </p>
        )}

        <div className="relative flex items-center overflow-x-auto">
          <div id='slider' className='scroll  scroll-smooth'>
            {category?.map((item, index) => (
              <div key={index} className="inline-block mr-[10px]">
                <button
                  className={`inline-flex items-center justify-center rounded-full py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 
                  ${categoryIndex === index ? 'text-white bg-[#1dc071]' : ''}`}
                  onClick={() => setCategoryIndex(index)}
                >
                  {item.categoryname}
                </button>
              </div>
            ))}
          </div>
        </div>

        {!isLoading && filteredCampaigns.length > 0 && filteredCampaigns.map((campaign) => (
          <FundCard
            key={uuidv4()}
            {...campaign}
            handleClick={() => handleNavigate(campaign)}
          />
        ))}
      </div>
    </div>
  );
};

export default DisplayCampaigns;

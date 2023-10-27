import React, { useState, useEffect } from 'react'

import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context'
//import { SignUp } from '../pages/sign-up';


//SIGN UP
// @notus-pro/react
//import ContactUs1 from "@notus-pro/react/ContactUs1"

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const { address, contract, getUserCampaigns } = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getUserCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  }

  useEffect(() => {
    if (contract) fetchCampaigns();
  }, [address, contract]);

  //SIGN UP = START

  //SIGN UP = END

  return (
    //<SignUp />
    <DisplayCampaigns 
      title="Your Campaigns"
      isLoading={isLoading}
      campaigns={campaigns}
    />
  )
}




export default Profile
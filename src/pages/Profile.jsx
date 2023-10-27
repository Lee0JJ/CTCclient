import React, { useState, useEffect } from 'react'

import { DisplayCampaigns, Loader } from '../components';
import { useStateContext } from '../context'
import { SignUp } from '../pages/sign-up';


const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  //User Status
  const [userStatus, setUserStatus] = useState(null); 

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

  return (
    
    <SignUp />
    // <DisplayCampaigns 
    //   title="Your Campaigns"
    //   isLoading={isLoading}
    //   campaigns={campaigns}
    // />
  )
}




export default Profile
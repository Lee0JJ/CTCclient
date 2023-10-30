import React, { useContext, useState, createContext } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite, useContractRead } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk';

//IPFS URL
import { useStorageUpload } from '@thirdweb-dev/react';

const StateContext = createContext();

function convertDatetimeToUint256(inputValue) {
  // Parse the date and time string into a JavaScript Date object
  const datetime = new Date(inputValue);

  // Convert the Date object to a Unix timestamp (seconds since January 1, 1970)
  const timestampInSeconds = Math.floor(datetime.getTime() / 1000);

  // Convert the Unix timestamp to a BigNumber (assuming you're using ethers.js)
  const uint256Timestamp = ethers.BigNumber.from(timestampInSeconds.toString());

  return uint256Timestamp;
}

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract('0xCF660b01FD689Df5C6Dc3b1abeb7603f0aF6C91B');
  const { mutateAsync: createConcert, isLoading } = useContractWrite(contract, "createConcert")
  const { mutateAsync: registerAsOrganizer, isLoading2 } = useContractWrite(contract, "registerAsOrganizer")

  const address = useAddress();
  const connect = useMetamask();

  //IPFS URL === START
  const [file, setFile] = useState('');
  const [uploadUrls, setUploadUrls] = useState('');
  const { mutateAsync: upload } = useStorageUpload();
  const [imageUrls, setImageUrls] = useState([]); // New state for image URLs

  const uploadToIpfs = async (file) => {
    const uploadUrl = await upload({
      data: [file],
      options: {
        uploadWithGatewayUrl: true,
        uploadWithoutDirectory: true
      }
    });
    return uploadUrl;
  };
  //IPFS URL === END

  const publishCampaign = async (form) => {
    try {
      const numConcert = await contract.call('getNumConcerts');

      // Format zoneInfo as a 2D array of uint256
      const zoneInfo = form.zoneInfo.map(row => [
        ethers.BigNumber.from(row.price),
        ethers.BigNumber.from(row.seatAmount)
      ]);

      console.log('form.numConcert:', numConcert.toNumber());
      console.log('form.name:', form.name);
      console.log('form.date:', convertDatetimeToUint256(form.date));
      console.log('form.venue:', form.venue);
      console.log('form.numZone:', ethers.BigNumber.from(form.numZone));
      console.log('form.zoneInfo:', zoneInfo);
      console.log('form.image:', await uploadToIpfs(form.image));


      const data = await createConcert({
        args: [
          numConcert.add(ethers.BigNumber.from(1)),
          form.name,
          convertDatetimeToUint256(form.date),
          form.venue,
          ethers.BigNumber.from(form.numZone),
          zoneInfo,
          await uploadToIpfs(form.image)
        ],
      });

      console.log("contract call success", data)
    } catch (error) {
      console.log("contract call failure", error)
    }
  }


  const getCampaigns = async () => {
    const campaigns = await contract.call('getConcerts');
    console.log(campaigns);
    const parsedCampaigns = campaigns.map((campaign, i) => ({
      cId: campaign.concertId.toNumber(),
      owner: campaign.owner,
      name: campaign.name,
      venue: campaign.venue, // Convert to string
      numZones: campaign.numZones.toNumber(),
      zoneInfo: campaign.zoneInfo,
      date: campaign.date.toNumber(),
      image: campaign.imageUrl,
      pId: i
    }));

    return parsedCampaigns;
  }


  const getCampaigns2 = async () => {
    const campaigns = await contract.call('getCampaigns');

    const parsedCampaings = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      image: campaign.image,
      pId: i
    }));

    return parsedCampaings;
  }

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

    return filteredCampaigns;
  }

  const donate = async (pId, amount) => {
    const data = await contract.call('donateToCampaign', [pId], { value: ethers.utils.parseEther(amount) });

    return data;
  }

  const getDonations = async (pId) => {
    const donations = await contract.call('getDonators', [pId]);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString())
      })
    }

    return parsedDonations;
  }

  const applyOrganizer = async (form) => {
    try {
      const numOrg = await contract.call('numOrganizers');

      console.log('form.numOrg:', numOrg.toNumber());
      console.log('form.name:', form.name);
      console.log('form.image:', await uploadToIpfs(form.image));


      const data = await registerAsOrganizer({
        args: [
          form.name,
          await uploadToIpfs(form.image)
        ],
      });

      console.log("contract call success", data)
    } catch (error) {
      console.log("contract call failure", error)
    }
  }

  const getOrganizer = async (onlyVerified, includeArchived) => {
    //const { data, isLoading } = useContractRead(contract, "viewAllOrganizers", [onlyVerified, includeArchived])
    const data = await contract.call('viewAllOrganizers', [onlyVerified, includeArchived]);
    console.log("Org Data :",data);
    const parsedOrganizer = data.map((organizer, i) => ({
      oId: organizer.organizerId.toNumber(),
      account: organizer.account,
      name: organizer.name,
      documentUrl: organizer.documentUrl,
      isVerified: organizer.isVerified,
      isArchived: organizer.isArchived,
      pId: i
    }));

    return parsedOrganizer;
  }


  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
        applyOrganizer,
        getOrganizer
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);
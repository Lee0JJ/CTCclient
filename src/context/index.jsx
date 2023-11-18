import React, { useContext, useState, createContext } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite, useContractRead } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk';
import { calTotalTickets } from '../utils';

//IPFS URL
import { useStorageUpload } from '@thirdweb-dev/react';

//AXIOS
import axios from 'axios';


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
  const { contract } = useContract('0xb00A1cfBaad7f63323A7C18ADb3BfC966EF0d86b');
  const { mutateAsync: createConcert, isLoading } = useContractWrite(contract, "createConcert")
  const { mutateAsync: createOrganizer, isLoading2 } = useContractWrite(contract, "registerAsOrganizer")

  const address = useAddress();
  const connect = useMetamask();

  //IPFS URL === START
  const [file, setFile] = useState('');
  const [uploadUrls, setUploadUrls] = useState('');
  const { mutateAsync: upload } = useStorageUpload();

  const uploadToIpfs = async (file) => {
    const uploadUrl = await upload({
      data: [file],
      options: {
        uploadWithGatewayUrl: true,
        uploadWithoutDirectory: false
      }
    });
    return uploadUrl;
  };
  //IPFS URL === END

  const publishCampaign = async (form) => {
    try {
      console.log('form:', form);
      const numConcert = await contract.call('numConcerts');

      // Format zoneInfo as a 2D array of uint256
      const zoneInfo = form.zoneInfo.map(row => [
        ethers.BigNumber.from(row.price),
        ethers.BigNumber.from(row.seatAmount)
      ]);

      // console.log('form.numConcert:', numConcert.toNumber());
      // console.log('form.name:', form.name);
      // console.log('form.date:', convertDatetimeToUint256(form.date));
      // console.log('form.venue:', form.venue);
      // console.log('form.numZone:', ethers.BigNumber.from(form.numZone));
      // console.log('form.zoneInfo:', zoneInfo);
      // console.log('form.image:', form.image);
      // console.log('form.imageURL', await uploadToIpfs(form.image));
      console.log('form.category', form.category);

      //Set ImageUrls by the uploaded image
      const imageUrls = await uploadToIpfs(form.image);

      console.log('imageUrls:', imageUrls);

      // const data = await createConcert({
      //   args: [
      //     numConcert.add(ethers.BigNumber.from(1)),
      //     form.name,
      //     convertDatetimeToUint256(form.date),
      //     form.venue,
      //     ethers.BigNumber.from(form.zoneInfo.length),
      //     zoneInfo,
      //     imageUrls
      //   ],
      // });

      console.log("contract call success");

      //create form for axios
      const concert = {
        organizerid: await getConcertOwnerId(address),
        name: form.name,
        owner: address,
        venue: form.venue,
        description: form.description,
        category: form.category.toString(),
        createdDate: new Date().toISOString().slice(0, -1),
        conductedDate: form.date,
        numZone: form.zoneInfo.length,
        zoneinfo: JSON.stringify(form.zoneInfo),
        totalSeat: calTotalTickets(form.zoneInfo),
        imgurl: imageUrls
      }

      await axios.post("http://localhost:8800/concert", concert);

      console.log("axios call success");

    } catch (error) {
      console.log("contract call failure", error)
    }
  }

  const updateCampaign = async (form) => {
    try {
      console.log('form:', form);
      // Format zoneInfo as a 2D array of uint256
      const zoneInfo = form.zoneInfo.map(row => [
        ethers.BigNumber.from(row.price),
        ethers.BigNumber.from(row.seatAmount)
      ]);

      // console.log('form.concertId:', numConcert.toNumber());
      // console.log('form.name:', form.name);
      // console.log('form.date:', convertDatetimeToUint256(form.date));
      // console.log('form.venue:', form.venue);
      // console.log('form.numZone:', ethers.BigNumber.from(form.numZone));
      // console.log('form.zoneInfo:', zoneInfo);
      // console.log('form.image:', form.image);
      // console.log('form.imageURL', await uploadToIpfs(form.image));

      const imageUrls = await uploadToIpfs(form.image);

      const data = await createConcert({
        args: [
          ethers.BigNumber.from(form.concertId),
          form.name,
          convertDatetimeToUint256(form.date),
          form.venue,
          ethers.BigNumber.from(form.numZone),
          zoneInfo,
          imageUrls
        ],
      });

      // console.log("contract call success", data)

      //update form for axios
      const concert = {
        organizerid: await getConcertOwnerId(address),
        name: form.name,
        owner: address,
        venue: form.venue,
        description: form.description,
        category: form.category.toString(),
        createdDate: new Date().toISOString().slice(0, -1),
        conductedDate: form.date,
        numZone: form.zoneInfo.length,
        zoneinfo: JSON.stringify(form.zoneInfo),
        totalSeat: calTotalTickets(form.zoneInfo),
        imgurl: imageUrls
      }
      console.log("update concert:", form.concertId)
      await axios.put(`http://localhost:8800/concert/${form.concertId}`, concert);

    } catch (error) {
      console.log("contract call failure", error)
    }
  }


  const getCampaigns = async () => {
    const campaigns = await contract.call('getConcerts');

    const parsedCampaigns = await Promise.all(
      campaigns.map(async (campaign, i) => {
        const zoneInfo = campaign.zoneInfo.map(row => ({
          price: row[0].toNumber(),
          seatAmount: row[1].toNumber()
        }));

        try {
          const response = await axios.get(`http://localhost:8800/concert/${i + 1}`);
          const description  = response.data.description;
          //convert category from string to array
          const category = response.data.category.split(",");
          return {
            cId: campaign.concertId.toNumber(),
            owner: campaign.owner,
            name: campaign.name,
            venue: campaign.venue.toString(),
            description: description,
            numZones: campaign.numZones.toNumber(),
            zoneInfo: zoneInfo,
            date: campaign.date.toNumber(),
            image: campaign.imageUrl,
            category: category,
            pId: i
          };
        } catch (error) {
          console.error('Error fetching concert data', error);
          return null;
        }
      })
    );

    const filteredCampaigns = parsedCampaigns.filter(campaign => campaign !== null);

    console.log("filteredCampaigns", filteredCampaigns);

    return filteredCampaigns;
  }

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

    return filteredCampaigns;
  }

  const getConcertOwnerId = async (address) => {
    // Get concert's owner organizer id
    const organizer = await getOrganizer();

    //find organizer id by their address
    const organizerId = organizer.find((organizer) => organizer.account === address).oId;

    return organizerId;
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

      // console.log('form.numOrg:', numOrg.toNumber());
      // console.log('form.name:', form.name);
      // console.log('form.document:', form.document);
      // console.log('form.image:', await uploadToIpfs(form.document));

      const imageUrls = await uploadToIpfs(form.document);

      const data = await createOrganizer({
        args: [
          form.name,
          imageUrls
        ],
      });

      console.log("contract call success", data)

      //create form for axios
      const organizer = {
        name: form.name,
        email: form.email,
        account: address,
        documenturl: imageUrls,
        isverified: false,
        isarchived: false
      }

      await axios.post("http://localhost:8800/organizer", organizer);


    } catch (error) {
      console.log("contract call failure", error)
    }
  }

  const getOrganizer = async () => {
    //const { data, isLoading } = useContractRead(contract, "viewAllOrganizers", [onlyVerified, includeArchived])
    const data = await contract.call('getOrganizers');
    const parsedOrganizer = data.map((organizer, i) => ({
      oId: organizer.organizerId.toNumber(),
      account: organizer.account,
      name: organizer.name,
      documentUrl: organizer.documentUrl,
      isVerified: organizer.isVerified,
      isArchived: organizer.isArchived,
      pId: i
    }));

    console.log("getOrganizer", parsedOrganizer);

    return parsedOrganizer;
  }


  const updateOrganizer = async (form) => {
    console.log("updateOrganizer", form)

    const imageUrls = await uploadToIpfs(form.documentUrl);

    try {
      const data = await contract.call('updateOrganizer', [
        ethers.BigNumber.from(form.oId),
        form.name,
        address,
        imageUrls,
        form.isVerified,
        form.isArchived
      ]);

      console.log("contract call success", data)

      //update form for axios
      const organizer = {
        oId: form.oId,
        name: form.name,
        email: form.email,
        account: address,
        documenturl: imageUrls,
        isverified: form.isVerified,
        isarchived: form.isArchived
      }

      await axios.put("http://localhost:8800/organizer", organizer);

    } catch (error) {
      console.log("contract call failure", error)
    }
  }

  const archiveOrganizer = async (organizerId) => {
    try {
      const data = await contract.call('archiveOrganizer', [
        organizerId
      ]);

      // console.log("contract call success", data)

      //update form for axios
      const organizer = {
        isArchived: true
      }

      console.log("archiveOrganizer", organizerId)
      await axios.put(`http://localhost:8800/organizer/${organizerId}`, organizer);

    } catch (error) {
      console.log("contract call failure", error)
    }
  }

  const setOrganizerStatus = async (organizerId, isVerified) => {
    try {
      const data = await contract.call('setOrganizerVerificationStatus', [
        organizerId, isVerified
      ]);

      // console.log("contract call success", data)

      //update form for axios
      const organizer = {
        IsVerified: isVerified
      }

      console.log("setOrganizerStatus", organizerId)
      await axios.put(`http://localhost:8800/organizer/${organizerId}`, organizer);

    } catch (error) {
      console.log("contract call failure", error)
    }
  }


  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        updateCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
        applyOrganizer,
        getOrganizer,
        updateOrganizer,
        archiveOrganizer,
        setOrganizerStatus
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);
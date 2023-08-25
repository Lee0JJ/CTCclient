import React, { useState } from 'react';
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { useContract, useContractWrite } from "@thirdweb-dev/react";



const CreateConcertPage = () => {
  const [formData, setFormData] = useState({
    gmail: '',
    concertId: '',
    concertname: '',
    date: '',
    venue: '',
    numZones: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // const ConcertCreate = ({ gmail, concertId, concertname, date, venue, numZones }) => {
  //   const { contract } = useContract("0xbb5318B3Dddf00C28ccf3bD9189748616bDa4531");
  //   const { mutateAsync: createConcert, isLoading } = useContractWrite(contract, "createConcert");

  //   const call = async () => {
  //     try {
  //       const data = await createConcert({ args: [gmail, concertId, concertname, date, venue, numZones] });
  //       console.info("contract call success", data);
  //     } catch (err) {
  //       console.error("contract call failure", err);
  //     }
  //   };
  // };

    const { contract } = useContract("0xbb5318B3Dddf00C28ccf3bD9189748616bDa4531");
    const { mutateAsync: createConcert, isLoading } = useContractWrite(contract, "createConcert");

    const call = async () => {
      try {
        const data = await createConcert({ args: [formData.gmail, formData.concertId, formData.concertname, formData.date, formData.venue, formData.numZones] });
        console.info("contract call success", data);
      } catch (err) {
        console.error("contract call failure", err);
      }
    };

  return (
    <ThirdwebProvider
      activeChain="goerli"
      clientId="83ec3aa672fe213e0223046e630d99d5"
    >
      <div>
        <h1>Create Concert</h1>
        <label>
          Gmail:
          <input type="text" id="gmail" value={formData.gmail} onChange={handleChange} />
        </label>
        <br />
        <label>
          Concert ID:
          <input type="text" id="concertId" value={formData.concertId} onChange={handleChange} />
        </label>
        <br />
        <label>
          Name:
          <input type="text" id="concertname" value={formData.concertname} onChange={handleChange} />
        </label>
        <br />
        <label>
          Date:
          <input type="text" id="date" value={formData.date} onChange={handleChange} />
        </label>
        <br />
        <label>
          Venue:
          <input type="text" id="venue" value={formData.venue} onChange={handleChange} />
        </label>
        <br />
        <label>
          Number of Zones:
          <input type="number" id="numZones" value={formData.numZones} onChange={handleChange} />
        </label>
        <br />
        <button onClick={() => call()}>Create</button>
      </div>
    </ThirdwebProvider>
  );
}

export default CreateConcertPage;

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useStateContext } from '../context';
import { money } from '../assets';
import { CustomButton, FormField, Loader } from '../components';
import { checkIfImage } from '../utils';

//IPFS URL
import { useStorageUpload } from '@thirdweb-dev/react';
import { ThirdwebStorage } from '@thirdweb-dev/storage';

import { tagType, thirdweb } from '../assets';
import { daysLeft, calTotalAvailableTickets, calLowestTicketPrice } from '../utils';

const EditConcert = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { createCampaign, updateCampaign } = useStateContext();
  const [form, setForm] = useState({
    concertId: state.cId,
    name: state.name,
      date: new Date(state.date * 1000).toISOString().substring(0, 16),
      venue: state.venue,
      numZone: state.numZone,
      zoneInfo: state.zoneInfo,
      image: state.image,
      description: state.description
    });



  //ZONE selection
  const [selectedZone, setSelectedZone] = useState(null);

  // Filter available zones
  const availableZones = state.zoneInfo;

  // Handle zone selection
  const handleZoneSelection = (zone) => {
    console.log(zone);
    setSelectedZone(zone);
  };

  //IPFS
  const { mutateAsync: upload } = useStorageUpload();
  const storage = new ThirdwebStorage();


  const handleFormFieldChange = async (fieldName, e) => {
    if (fieldName == 'image') {
      setForm({ ...form, [fieldName]: e })
    } else {
      setForm({ ...form, [fieldName]: e.target.value })
    }
  }

  //ADD ZONE === START
  const [rows, setRows] = useState([{ price: '', seatAmount: '' }]);

  const addRow = () => {
    setForm((prevForm) => ({
      ...prevForm,
      zoneInfo: [...prevForm.zoneInfo, { price: '', seatAmount: '' }]
    }));
    console.log(Number(state.zoneInfo));
    console.log(Number(state.zoneInfo[0][0]));
  };

  const removeRow = (index) => {
    if (form.zoneInfo.length > 1) {
      setForm((prevForm) => {
        const newZoneInfo = [...prevForm.zoneInfo];
        newZoneInfo.splice(index, 1);
        return { ...prevForm, zoneInfo: newZoneInfo };
      });
    }
  };

  const handleInputChange = (index, subIndex, e) => {
    const fieldName = e.target.name; // Get the field name from the input's name attribute
    const value = e.target.value;
    setForm((prevForm) => {
      const newZoneInfo = [...prevForm.zoneInfo];
      const [field, fieldIndex] = fieldName.split('-'); // Split the field name into parts
      newZoneInfo[index][subIndex] = value;
      return { ...prevForm, zoneInfo: newZoneInfo };
    });
  };
  //ADD ZONE === END

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      //set numZone = zoneInfo.length
      form.numZone = form.zoneInfo.length;
      await updateCampaign({ ...form });
      setIsLoading(false);
      navigate('/profile');
    } catch (error) {
      console.error('Error handling form submission:', error);
      setIsLoading(false);
    }
  }


  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && <Loader />}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Start a Campaign</h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Concert Name *"
            placeholder="Concert 1"
            inputType="text"
            value={form.name}
            handleChange={(e) => handleFormFieldChange('name', e)}
          />

          <FormField
            labelName="Venue Location *"
            placeholder="Write a location"
            inputType="text"
            value={form.venue}
            handleChange={(e) => handleFormFieldChange('venue', e)}
          />
        </div>

        <FormField
          labelName="Date *"
          placeholder="Date"
          inputType="datetime-local"
          value={form.date}
          handleChange={(e) => handleFormFieldChange('date', e)}
        />

        <FormField
          labelName="Description *"
          placeholder="Write concert's description"
          isTextArea
          value={form.description}
          handleChange={(e) => handleFormFieldChange('description', e)}
        />

        <div className="w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]">
          <img src={money} alt="money" className="w-[40px] h-[40px] object-contain" />
          <h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]">You will get 100% of the ticket price</h4>
        </div>

        {/* ADD ZONE === START*/}
        <div className="p-4">
          {form.zoneInfo.map((row, index) => (
            <div key={index} className="flex space-x-4 mb-4">
              <input
                min={1}
                type="number"
                name={`price-${index}`}
                value={row.price}
                onChange={(e) => handleInputChange(index, 'price', e)}
                placeholder="Price"
                className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
              <input
                min={1}
                type="number"
                name={`seatAmount-${index}`}
                value={row.seatAmount}
                onChange={(e) => handleInputChange(index, 'seatAmount', e)}
                placeholder="Seat Amount"
                className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
              <button
                type='button'
                onClick={() => removeRow(index)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none"
              >
                Remove Row
              </button>
            </div>
          ))}
          <button
            type='button'
            onClick={addRow}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            Add Row
          </button>
        </div>

        {/* ADD ZONE === END */}

        {/* <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Goal *"
            placeholder="ETH 0.50"
            inputType="text"
            value={form.target}
            handleChange={(e) => handleFormFieldChange('target', e)}
          />

        </div> */}

        {/* UPLOAD IMAGE */}
        <FormField
          labelName="Campaign image (Legacy image will be deleted)*"
          placeholder="Place image URL of your campaign"
          inputType="file"
          // Remove the value attribute as we are storing URLs in state
          handleChange={(e) => handleFormFieldChange('image', e.target.files)}
        />
        {/* END OF UPLOAD IMAGE */}

        <div className="flex justify-center items-center mt-[40px]">
          <CustomButton
            btnType="submit"
            title="Update Concert"
            styles="bg-[#1dc071]"
          />
        </div>
      </form>
    </div>
  )
}

export default EditConcert
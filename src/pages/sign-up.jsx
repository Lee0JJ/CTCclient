import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context';

import { CustomButton, FormField, Loader } from '../components';

//IPFS URL
import { useStorageUpload } from '@thirdweb-dev/react';

//SIGN UP TEMPLATE
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { SimpleFooter } from "../widgets/layout/simple-footer";

export function SignUp() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { applyOrganizer } = useStateContext();
  const [form, setForm] = useState({
    name: '',
    email: '',
    document: []
  });

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value })
  }

  //IPFS URL === START
  const [file, setFile] = useState(null);
  const { mutateAsync: upload } = useStorageUpload();

  const uploadToIpfs = async () => {
    const uploadUrl = await upload({
      data: [file],
      options: {
        uploadWithGatewayUrl: true,
        uploadWithoutDirectory: true
      }
    })
    console.log('Upload URL:', uploadUrl);
  }
  //IPFS URL === END

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true)
    await applyOrganizer({ ...form })
    setIsLoading(false);
  }

  return (
    <>
      {/* <img
      src="src/assets/logo.svg"
      className="absolute  h-full w-full object-cover"
    /> */}
      <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
        {isLoading && <Loader />}
        <div className="absolute w-full " />
        <div className="container mx-auto p-4">
          <Card className="absolute top-2/4 left-2/4 w-full max-w-[24rem] -translate-y-2/4 -translate-x-2/4">
            <CardHeader
              variant="gradient"
              color="blue"
              className="mb-4 grid h-28 place-items-center"
            >
              <Typography variant="h3" color="white">
                Sign Up
              </Typography>
            </CardHeader>
            <CardBody className="flex flex-col gap-4">
              {/* <FormField
            labelName="Your Name *"
            placeholder="John Doe"
            inputType="text"
            value={form.name}
            handleChange={(e) => handleFormFieldChange('name', e)}
          /> */}
              <Input required variant="standard" label="Organization Name" size="lg" onChange={(e) => handleFormFieldChange('name', e)} />
              <Input required variant="standard" type="email" label="Organization Email" size="lg" onChange={(e) => handleFormFieldChange('email', e)} />
              <Input required variant="standard" type="file" label="Organization Document" size="lg" onChange={(e) => handleFormFieldChange('document', e)} />
              {/* <Input
              variant="standard"
              type="password"
              label="Password"
              size="lg"
            /> */}
              <div className="-ml-2.5">
                <Checkbox label="I agree the Terms and Conditions" />
              </div>
            </CardBody>
            <CardFooter className="pt-0">
              {/* <Button variant="gradient" fullWidth >
                Sign Up
              </Button> */}
              <CustomButton
                btnType="submit"
                title="Submit new campaign"
                styles="bg-[#1dc071]"
                className="center"
              />
            </CardFooter>
          </Card>
        </div>
      </form>
    </>
  );
}

export default SignUp;

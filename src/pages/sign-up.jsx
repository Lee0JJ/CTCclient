import React, { useState, useEffect } from 'react'
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

export function SignUp({ org }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { address, contract, getOrganizer, applyOrganizer, updateOrganizer } = useStateContext();
  const [form, setForm] = useState({
    oId: '',
    name: '',
    email: '',
    account: address,
    document: [],
    isVerified: false,
    isArchived: false
  });

  const handleFormFieldChange = (fieldName, e) => {
    if (fieldName == 'document') {
      setForm({ ...form, [fieldName]: e })
    } else {
      setForm({ ...form, [fieldName]: e.target.value })
    }
  }

  const [isChecked, setIsChecked] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      if (!org) {
        console.log("Create Form", form);
        await applyOrganizer({ ...form });
      } else {
        console.log("Update form", form);
        await updateOrganizer({ ...form, oId: org.orgId.oId });
      }
      setIsLoading(false);
      navigate('/');
    } catch (error) {
      console.error('Error handling form submission:', error);
      setIsLoading(false);
    }
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
                SIGN UP
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
              <Input required variant="standard" multiple type="file" label="Organization Document" size="lg" onChange={(e) => handleFormFieldChange('document', e.target.files)} />
              {/* <Input
              variant="standard"
              type="password"
              label="Password"
              size="lg"
            /> */}
              <div className="">
                {/* <Checkbox 
                  label="I agree the Terms and Conditions" onChange={(e) => handleFormFieldChange('term', e)}
                /> */}
                <div>
                  <label
                    htmlFor="checkboxLabelTwo"
                    className="flex cursor-pointer select-none items-center"
                  >
                    <div className="relative">
                      <input
                        required
                        type="checkbox"
                        id="checkboxLabelTwo"
                        className="sr-only"
                        onChange={() => {
                          setIsChecked(!isChecked);
                        }}
                      />
                      <div
                        className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${isChecked && 'border-primary bg-gray dark:bg-transparent'
                          }`}
                      >
                        <span className={`opacity-0 ${isChecked && '!opacity-100'}`}>
                          <svg
                            width="11"
                            height="8"
                            viewBox="0 0 11 8"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                              fill="#3056D3"
                              stroke="#3056D3"
                              strokeWidth="0.4"
                            ></path>
                          </svg>
                        </span>
                      </div>
                    </div>
                    I agree the Terms and Conditions
                  </label>
                </div>

              </div>
            </CardBody>
            <CardFooter className="pt-0">
              {/* <Button variant="gradient" fullWidth >
                Sign Up
              </Button> */}
              <CustomButton
                btnType="submit"
                title="Sign Up"
                styles="bg-[#1dc071] w-full"
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

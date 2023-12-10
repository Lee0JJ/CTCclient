import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { logo, sun } from '../assets';
import { navlinks } from '../constants';

import useColorMode from '../hooks/useColorMode';

import { useStateContext } from '../context';
import { Contract } from 'ethers';

const Icon = ({ styles, name, imgUrl, isActive, disabled, handleClick }) => (
  <div className={`w-[48px] h-[48px] rounded-[10px] ${isActive && isActive === name && 'bg-[#2c2f32]'} flex justify-center items-center ${!disabled && 'cursor-pointer'} ${styles}`} onClick={handleClick}>
    {!isActive ? (
      <img src={imgUrl} alt="fund_logo" className="w-1/2 h-1/2" />
    ) : (
      <img src={imgUrl} alt="fund_logo" className={`w-1/2 h-1/2 ${isActive !== name && 'grayscale'}`} />
    )}
  </div>
)

const Sidebar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState('dashboard');
  const { contract, address, getAdmin } = useStateContext();

  const [admin, setAdmin] = useState('');
  let access = [];
  const clientAccess = ['dashboard', 'profile', 'concertcreate'];

  useEffect(() => {
    const fetchAdmin = async () => {
      if (address) {
        const admin = await getAdmin();
        setAdmin(admin);
      }
    };
    fetchAdmin();
    return () => {
      // Clean-up code here (if needed)
    };
  }, [address, contract]);

  //Color Mode
  const [colorMode, setColorMode] = useColorMode();

  return (
    <div className="flex justify-between items-center flex-col sticky top-5 h-[93vh]">
      <Link to="/">
        <Icon styles="w-[52px] h-[52px] bg-[#2c2f32]" imgUrl={logo} />
      </Link>

      <div className="flex-1 flex flex-col justify-between items-center bg-[#1c1c24] rounded-[20px] w-[76px] py-4 mt-12">
        <div className="flex flex-col justify-center items-center gap-3">
          {navlinks.map((link) => (
            (address == admin || clientAccess.includes(link.name)) && (
              <Icon
                key={link.name}
                {...link}
                isActive={isActive}
                handleClick={() => {
                  if (!link.disabled) {
                    setIsActive(link.name);
                    navigate(link.link);
                  }
                }}
              />
            )
          ))}
        </div>

        <Icon styles="bg-[#1c1c24]" imgUrl={sun} className="dur absolute top-0 z-50 m-0 h-full w-full cursor-pointer opacity-0" />
      </div>
    </div>
  )
}

export default Sidebar
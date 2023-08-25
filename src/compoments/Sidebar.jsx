import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { logo, sun } from '../assets'
import { navlinks } from '../constants'

const Icon = ({ styles, name, imgUrl, isActive, disabled, handleClick }) => (
  <div className={`w-[48px] h-[48px] rounded-[10px] ${isActive && isActive === name && 'bg-[#2c2f32]'} flex justify-center items-center ${!disabled && 'cursor-pointer'} ${styles}`} onClick={handleClick}>
    {!isActive ? (
      <img src={imgUrl} alt="fund_logo" className="w-1/2 h-1/2" />
    ) : (
      <img src={imgUrl} alt="fund_logo" className={`w-1/2 h-1/2 ${isActive !== name && 'grayscale'}`} />
    )}
  </div>
)




const Sidebar = ({ user, setUser, setIsLoggedIn }) => {
  const navigate = useNavigate();
  //const [user, setUser] = useState(userObject);
  const [isActive, setIsActive] = useState('dashboard');

  const filteredNavlinks = navlinks.filter(link => link.name !== "profile" && link.name !== "logout");

  const handleSignOut = () => {
    // Clear user state and set isLoggedIn to false
    setUser(null);
    setIsLoggedIn(false);

    // Redirect to the signin page
    navigate('/');
  };
  
  return (
    <div className='sticky flex flex-col items-center justify-between top-5 h-[93vh]'>

      <Link to="/">
        <Icon styles="w-[52px] h-[52px] bg-[#2c2f32]" imgUrl={logo} />
      </Link>

      <div className='flex flex-col items-center justify-between flex-1 bg-[#1c1c24] rounded-[20px] w-[76px] py-4 mt-12'>
        <div className='flex flex-col items-center justify-centergap-3'>
          {filteredNavlinks.map((link) => (
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
          ))}

          {/* Manually create the Icon for the login button */}
          <div>
            <Icon
              styles=""
              imgUrl={!user ? navlinks[4].imgUrl : user.picture}
              name={navlinks[4].name}
              isActive={isActive}
              disabled={navlinks[4].disabled}
              handleClick={() => {
                if (!navlinks[4].disabled) {
                  setIsActive(navlinks[4].name);
                  navigate(navlinks[4].link);
                }
              }
              }
            />
          </div>

          {/* Manually create the Icon for the log out button */}
          <div onClick={handleSignOut}>
            <Icon
              styles=""
              imgUrl={navlinks[5].imgUrl}
              name={navlinks[5].name}
              isActive={isActive}
              disabled={navlinks[5].disabled}
              handleClick={() => {
                if (!navlinks[5].disabled) {
                  setIsActive(navlinks[5].name);
                  navigate(navlinks[5].link);
                  handleSignOut();
                }
              }
              }
            />
          </div>


        </div>

        <Icon styles="bg-[#1c1c24] shadow-secondary" imgUrl={sun} />
      </div>
    </div>
  )
}

export default Sidebar
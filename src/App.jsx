import React, {useState} from 'react';
import { Route, Routes } from 'react-router-dom';

import { Sidebar, Navbar } from './components';
import { CampaignDetails, CreateCampaign, Home, Profile } from './pages';
import { CreateConcert, ListOrganizer, EditConcert, UseTicket } from './pages';

const App = () => {

  const [searchWord, setSearchWord] = useState('');

  const handleSearch = (word) => {
    setSearchWord(word);
  };

  return (
    <div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
      <div className="sm:flex hidden mr-10 relative">
        <Sidebar />
      </div>

      <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
        <Navbar onSearch={handleSearch} />

        <Routes>
          <Route path="/" element={<Home searchWord={searchWord} />} />
          <Route path="/profile" element={<Profile searchWord={searchWord}/>} />
          <Route path="/useticket" element={<UseTicket />} />
          <Route path="/create-concert" element={<CreateConcert />} />
          <Route path="/list-organizer" element={<ListOrganizer />} />
          <Route path="/edit-concert/:id" element={<EditConcert  />} />
          <Route path="/concert-details/:id" element={<CampaignDetails />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
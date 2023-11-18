import { createCampaign, dashboard, logout, payment, profile, withdraw } from '../assets';

export const navlinks = [
  {
    name: 'dashboard',
    imgUrl: dashboard,
    link: '/',
  },
  {
    name: 'concertcreate',
    imgUrl: createCampaign,
    link: '/create-concert',
  },
  {
    name: 'organizerlist',
    imgUrl: payment,
    link: '/list-organizer',
    disabled: false,
  },
  // {
  //   name: 'concertedit',
  //   imgUrl: withdraw,
  //   link: '/edit-concert',
  //   disabled: false,
  // },
  {
    name: 'profile',
    imgUrl: profile,
    link: '/profile',
  },
  // {
  //   name: 'logout',
  //   imgUrl: logout,
  //   link: '/',
  //   disabled: false,
  // },
];

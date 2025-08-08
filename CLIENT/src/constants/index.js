import {
  benefitImage2,
  chromecast,
  disc02,
  discord,
  discordBlack,
  facebook,
  figma,
  file02,
  framer,
  homeSmile,
  instagram,
  notification2,
  notification3,
  notification4,
  notion,
  photoshop,
  plusSquare,
  protopie,
  raindrop,
  recording01,
  recording03,
  searchMd,
  slack,
  sliders04,
  telegram,
  twitter,
} from "../assets";

import image1 from '../assets/benefits/image-1.jpeg';
import image2 from '../assets/benefits/image-6.png';
import image3 from '../assets/benefits/image-3.jpeg';
import image4 from '../assets/benefits/image-4.jpeg';
import image5 from '../assets/benefits/image-5.jpeg';
import card1 from '../assets/benefits/card-1.svg';
import card2 from '../assets/benefits/card-2.svg';
import card3 from '../assets/benefits/card-3.svg';
import card4 from '../assets/benefits/card-4.svg';
import card5 from '../assets/benefits/card-5.svg';

export const navigation = [
  {
    id: "0",
    title: "Features",
    url: "#features",
  },
  {
    id: "2",
    title: "Services",
    url: "#how-to-use",
  },
  {
    id: "3",
    title: "FAQ",
    url: "#faq",
  },
  {
    id: "4",
    title: "New account",
    url: "#signup",
    onlyMobile: true,
  },
  {
    id: "5",
    title: "Sign in",
    url: "#login",
    onlyMobile: true,
  },
];

export const heroIcons = [homeSmile, file02, searchMd, plusSquare];

export const notificationImages = [notification4, notification3, notification2];

export const companyLogos = [];


export const risunServices = [
  "Power Generation Forecasting",
  "Solar Energy Performance Monitoring",
  "Adaptive Power Prediction",
];

export const risunServicesIcons = [
  recording03,
  recording01,
  disc02,
  chromecast,
  sliders04,
];


export const collabText =
  "Optimize solar grid placement with smart automation and real-time environmental analysis for maximum energy output.";

export const collabContent = [
  {
    id: "0",
    title: "Seamless Integration",
    text: collabText,
  },
  {
    id: "1",
    title: "Smart Automation",
    text: "Leverage advanced automation to continuously monitor and adjust solar grid operations, ensuring peak efficiency without manual intervention."
  },
  {
    id: "2",
    title: "Top-notch Security",
    text: "Protect your energy infrastructure with robust security protocols that safeguard data integrity and prevent unauthorized access at all levels."
  },
];


export const collabApps = [
  {
    id: "0",
    title: "Figma",
    icon: figma,
    width: 26,
    height: 36,
  },
  {
    id: "1",
    title: "Notion",
    icon: notion,
    width: 34,
    height: 36,
  },
  {
    id: "2",
    title: "Discord",
    icon: discord,
    width: 36,
    height: 28,
  },
  {
    id: "3",
    title: "Slack",
    icon: slack,
    width: 34,
    height: 35,
  },
  {
    id: "4",
    title: "Photoshop",
    icon: photoshop,
    width: 34,
    height: 34,
  },
  {
    id: "5",
    title: "Protopie",
    icon: protopie,
    width: 34,
    height: 34,
  },
  {
    id: "6",
    title: "Framer",
    icon: framer,
    width: 26,
    height: 34,
  },
  {
    id: "7",
    title: "Raindrop",
    icon: raindrop,
    width: 38,
    height: 32,
  },
];

export const benefits = [
  {
    id: "0",
    title: "Fault Detection",
    text: "Spot Faults, Boost Performance: Upload, Detect, and Optimize with Confidence!",
    backgroundUrl: card1,
    image: image1, // replace this with the actual image path
    imageUrl: benefitImage2,
  },
  {
    id: "1",
    title: "Site Suitability Recommendations",
    text: "Find the Perfect Spot: Power Your Solar Setup with Precision Heatmaps!",
    backgroundUrl: card2,
    image: image2, // replace this with the actual image path
    light: true,
    imageUrl: benefitImage2,
  },
  {
    id: "2",
    title: "Solar Power Forecast",
    text: "Predict the Sun's Power: Optimize Solar Output with Data-Driven Insights!",
    backgroundUrl: card3,
    image: image3, // replace this with the actual image path
    imageUrl: benefitImage2,
  },
  {
    id: "3",
    title: "Solar Panel Installation and Management Manual",
    text: "Maximize Solar Energy: Expert Tips for Seamless Installation and Management!",
    backgroundUrl: card4,
    image: image4, // replace this with the actual image path
    light: true,
    imageUrl: benefitImage2,
  },
  {
    id: "4",
    title: "Monitoring Tab",
    text: "Track Solar Performance: Monitor, Manage, and Maximize Output with Ease!",
    backgroundUrl: card5,
    image: image5, // replace this with the actual image path
    imageUrl: benefitImage2,
  },
];


export const socials = [
  {
    id: "0",
    title: "Discord",
    iconUrl: discordBlack,
    url: "#",
  },
  {
    id: "1",
    title: "Twitter",
    iconUrl: twitter,
    url: "#",
  },
  {
    id: "2",
    title: "Instagram",
    iconUrl: instagram,
    url: "#",
  },
  {
    id: "3",
    title: "Telegram",
    iconUrl: telegram,
    url: "#",
  },
  {
    id: "4",
    title: "Facebook",
    iconUrl: facebook,
    url: "#",
  },
];

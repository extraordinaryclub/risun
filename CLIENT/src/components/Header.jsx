import { useLocation, useNavigate } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { risun } from "../assets";
import { navigation } from "../constants";
import Button from "./Button";
import { useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openNavigation, setOpenNavigation] = useState(false);

  const handleClick = () => {
    if (!openNavigation) return;
    enablePageScroll();
    setOpenNavigation(false);
  };

  const handleSignInClick = () => {
    navigate("/loginpage");
  };

  const handleRegisterClick = () =>{
    navigate("/registerpage");
  }
  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 border-b border-n-6 bg-n-8/90 backdrop-blur-sm ${
        openNavigation ? "bg-n-8" : ""
      }`}
    >
      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
        {/* Logo and Title */}
        <a className="block w-[12rem] xl:mr-8 flex items-center" href="#hero">
          <img
            src={risun}
            width={190}
            height={40}
            alt="RISUN"
            className="inline-block -mx-15"
          />
          <span className="ml-1 text-gray-800 text-2xl font-extrabold font-sans">
            RI<span className="text-[#ffffff]">SUN</span>
          </span>
        </a>

        {/* Navigation Menu */}
        <nav
      className={`${
        openNavigation ? "flex" : "hidden"
      } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent`}
    >
      <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
        {navigation.map((item) => (
          <a
            key={item.id}
            href={item.url}
            onClick={handleClick}
            className={`block relative font-code text-3xl uppercase font-extrabold transition-colors lg:text-sm lg:font-semibold ${
              item.onlyMobile ? "lg:hidden" : ""
            } px-6 py-6 md:py-8 lg:-mr-0.25 lg:leading-5 xl:px-12 ${
              location.pathname === item.url // Compare current pathname
                ? "text-[#402400] z-2" // Active state with specified color
                : "text-[#402400] hover:text-[#8B5A2B]" // Default state with hover color
            }`}
          >
            {item.title}
          </a>
        ))}
      </div>
    </nav>

        {/* Account Links */}
        <Button className="mr-5" onClick={handleRegisterClick}>
          Register
        </Button>

        {/* Sign In Button */}
        <Button className=" " onClick={handleSignInClick}>
          Sign in
        </Button>

      </div>
    </div>
  );
};

export default Header;
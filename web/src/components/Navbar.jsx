import { useState } from "react";

import { logo } from "../assets/index";
import { navLinks } from "../constants";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [active, setActive] = useState("Home");
  const [toggle, setToggle] = useState(false);
  
  const location = useLocation();
  
  function getTextColor(navElementTitle) {
    return active === navElementTitle ? "text-white" : "text-dimWhite";
  }
  
  function getNavElement(nav) {
    let element = <a href={`#${nav.id}`}>{nav.title}</a>;
    if (nav.id == "signIn") {
      return <Link to="SignIn">{element}</Link>;
    } else if (location.pathname == "/") {
      return element;
    } else {
      return <Link to="/">{element}</Link>;
    }
  }

  return (
    <nav className="w-full flex py-6 justify-between items-center navbar">
      <img src={logo} alt="hrf" className="w-[124px] h-[32px]" />

      <ul className="list-none sm:flex hidden justify-end items-center flex-1">
        {navLinks.map((nav) => (
          <li
            key={nav.id}
            className={`font-poppins font-normal cursor-pointer text-[16px] ml-10 ${getTextColor(nav.title)}`}
            onClick={() => setActive(nav.title)}
          >
            {getNavElement(nav)}
          </li>
        ))}
      </ul>

      <div className="sm:hidden flex flex-1 justify-end items-center">

        <div
          className={`${
            !toggle ? "hidden" : "flex"
          } p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar`}
        >
          <ul className="list-none flex justify-end items-start flex-1 flex-col">
            {navLinks.map((nav, index) => (              
              <li
                key={nav.id}
                className={`font-poppins font-medium cursor-pointer text-[16px] ${
                  active === nav.title ? "text-white" : "text-dimWhite"
                } ${index === navLinks.length - 1 ? "mb-0" : "mb-4"}`}
                onClick={() => setActive(nav.title)}
              >
                <a href={`#${nav.id}`}>{nav.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

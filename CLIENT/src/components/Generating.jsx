import { loading } from "../assets";
import PropTypes from "prop-types";

const Generating = ({ className }) => {
  return (
    <div
      className={`flex items-center h-[3.5rem] px-2 bg-n-8/80 rounded-[1.7rem] ${
        className || ""
      } text-base whitespace-nowrap`} // Adjusted padding and added whitespace-nowrap
    >
      <img className="w-5 h-5 mr-2" src={loading} alt="Loading" />{" "}
      {/* Adjusted margin */}
      Transforming sunlight into power, hang tight!
       {/* Updated headline */}
    </div>
  );
};
Generating.propTypes = {
  className: PropTypes.string, // className is optional and should be a string
};
export default Generating;

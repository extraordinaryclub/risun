import PropTypes from 'prop-types';
const CompanyLogos = ({ className }) => {
  return (
    <div className={className}>
      <h5 className="tagline mb-6 text-center text-n-2/50">
        Empowering Grid Station Heroes with Smarter Solar Solutions – Boost
        Efficiency, Ensure Reliability!
      </h5>
      {/* <ul className="flex">
        {companyLogos.map((logo, index) => (
          <li
            className="flex items-center justify-center flex-1 h-[8.5rem]"
            key={index}
          >
            <img src={logo} width={134} height={28} alt={logo} />
          </li>
        ))}
      </ul> */}
    </div>
  );
};

CompanyLogos.propTypes = {
  className: PropTypes.string, // Expect className to be a string
};

export default CompanyLogos;

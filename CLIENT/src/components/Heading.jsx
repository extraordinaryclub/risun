import TagLine from "./Tagline";
import PropTypes from "prop-types";

const Heading = ({ className, title, text, tag }) => {
  return (
    <div
      className={`${className} max-w-[50rem] mx-auto mb-12 lg:mb-20 md:text-center`}
    >
      {tag && <TagLine className="mb-4 md:justify-center">{tag}</TagLine>}
      {title && <h2 className="h2">{title}</h2>}
      {text && <p className="body-2 mt-4 text-n-4">{text}</p>}
    </div>
  );
};

Heading.propTypes = {
  className: PropTypes.string,  // className is optional and should be a string
  title: PropTypes.string,      // title is optional and should be a string
  text: PropTypes.string,       // text is optional and should be a string
  tag: PropTypes.string,        // tag is optional and should be a string
};

export default Heading;

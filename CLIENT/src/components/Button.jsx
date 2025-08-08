import ButtonSvg from "../assets/svg/ButtonSvg";

const Button = ({ className, href, onClick, children, px, white }) => {
  const classes = `
    button relative inline-flex items-center justify-center h-12 transition-all duration-300 ease-in-out
    ${px || "px-8"}
    ${white ? "text-[#E88004]" : "text-n-1"} 
    ${className || ""}
    hover:text-white font-semibold text-lg rounded-lg group
    shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500
    transform group-hover:scale-105
  `; // Scale effect on hover

  const spanClasses = `
    relative z-20 font-extrabold
  `; // No animation on the text

  const hoverBackground = `
    absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg transition-transform duration-300 ease-in-out transform scale-0
    group-hover:scale-105 group-hover:shadow-lg z-10
  `; // Subtle scaling effect on the background

  const renderButton = () => (
    <button className={classes} onClick={onClick}>
      <span className={hoverBackground}></span>
      <span className={spanClasses}>{children}</span>
      {ButtonSvg(white)}
    </button>
  );

  const renderLink = () => (
    <a href={href} className={classes}>
      <span className={hoverBackground}></span>
      <span className={spanClasses}>{children}</span>
      {ButtonSvg(white)}
    </a>
  );

  return href ? renderLink() : renderButton();
};

export default Button;






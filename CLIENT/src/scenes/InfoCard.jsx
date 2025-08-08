import React from "react";

const InfoCard = ({ title, description }) => {
    const speak = (text) => {
        const speech = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(speech);
      };
    
      // Handle hover to trigger TTS with title and description
      const handleMouseEnter = () => {
        const descriptionText = Array.isArray(description) ? description.join('. ') : description;
        const fullText = `${title}. ${descriptionText}`;
        speak(fullText);
      };
    
      // Cancel any ongoing speech synthesis
      const cancelSpeech = () => {
        window.speechSynthesis.cancel();
      };
    
  return (
<div className="relative w-full h-72 transition-transform transform hover:scale-105 hover:shadow-lg duration-300 ease-in-out" onMouseEnter={handleMouseEnter} onMouseLeave={cancelSpeech} >
<svg
        preserveAspectRatio="none"
        width="100%"
        height="100%"
        viewBox="0 0 384 366"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          vectorEffect="non-scaling-stroke"
          d="M32 1H319.453C328.037 1 336.238 4.5601 342.1 10.832L374.648 45.6545C380.015 51.3966 383 58.9629 383 66.8225V334C383 351.121 369.121 365 352 365H32C14.8792 365 1 351.121 1 334V32C1 14.8792 14.8792 1 32 1Z"
          stroke="white"
          strokeOpacity="0.15"
          strokeWidth="2"
        />
        <path
          vectorEffect="non-scaling-stroke"
          d="M32 1H319.453C328.037 1 336.238 4.5601 342.1 10.832L374.648 45.6545C380.015 51.3966 383 58.9629 383 66.8225V334C383 351.121 369.121 365 352 365H32C14.8792 365 1 351.121 1 334V32C1 14.8792 14.8792 1 32 1Z"
          stroke="url(#paint0_linear_333_9188)"
          strokeOpacity="0.85"
          strokeWidth="2"
        />
        <defs>
          <linearGradient
            id="paint0_linear_333_9188"
            x1="192"
            y1="0"
            x2="192"
            y2="366"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#33CEFF" />
            <stop offset="0.562842" stopColor="#D633FF" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      {/* Overlay Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-semibold text-center">
        
        <h3>{title}</h3>
<div>
  {Array.isArray(description) 
    ? description.map((line, index) => <p key={index}>{line}</p>) 
    : description}
</div>
      </div>
    </div>
  );
};

export default InfoCard;
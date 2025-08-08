import React, { useRef } from 'react';
import image1 from '../assets/image1.png';
import image2 from '../assets/image2.png';
import image3 from '../assets/image3.png';
import image4 from '../assets/image4.png';
import image5 from '../assets/image5.png';

const TextToSpeech = ({ text, children }) => {
  const utteranceRef = useRef(null);

  const speak = () => {
    // Stop any ongoing speech to prevent overlapping
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    // Create a new utterance
    utteranceRef.current = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utteranceRef.current);
  };

  const stop = () => {
    // Cancel the specific utterance currently being spoken
    speechSynthesis.cancel();
  };

  return (
    <div onMouseEnter={speak} onMouseLeave={stop}>
      {children}
    </div>
  );
};


const UserManual = () => {
  return (

        <div className="bg-customDark w-full h-full pl-10">
        
          <div className="grid grid-cols-2 gap-x-6 gap-y-7">

        <TextToSpeech text="Welcome to the Solar Panel Installation and Management Manual. This section provides grid operators with essential guidance for optimizing solar grid placement and management. By leveraging the latest industry standards and best practices, you can enhance energy output and ensure the efficient operation of your solar installations.">
          <div className="bg-yellow-200 text-[#101624] p-6 mt-4 rounded-xl w-full h-[470px] transition-transform transform hover:scale-105">
              <h1 className='text-5xl font-bold'>Introduction</h1>
              <br />
              <p>
                Welcome to the Solar Panel Installation and Management Manual. This section
                provides grid operators with essential guidance for optimizing solar grid placement
                and management. By leveraging the latest industry standards and best practices, 
                you can enhance energy output and ensure the efficient operation of your solar installations.
              </p>
              <img className="w-[713px] h-[250px] mt-4" src={image1} alt="Solar panel management illustration" />
            </div>
          </TextToSpeech>

          <TextToSpeech text="Site Assessment Checklist: Location Analysis:Evaluate geographical features that may obstruct sunlight (e.g., trees, buildings), Shading Assessment:Identify potential shading sources during different times of the day and seasons, Soil Condition:Assess soil type and stability for mounting structures, Accessibility: Ensure the site is accessible for installation and maintenance, Regulatory Compliance:Check local regulations and obtain necessary permits">

            <div className="bg-yellow-200 text-[#101624] p-6 rounded-xl w-[600px] h-[1000px] row-span-2 mt-4 transition-transform transform hover:scale-105">
              <h1 className='text-5xl font-bold'>Site Assessment Checklist</h1>
              <br />
            
                <ul className="list-disc pl-2 ">
                <li> <strong>Location Analysis:</strong> Evaluate geographical features that may obstruct sunlight (e.g., trees, buildings).</li>
                <li> <strong>Shading Assessment</strong>: Identify potential shading sources during different times of the day and seasons.</li>
                <li><strong>Soil Condition:</strong> Assess soil type and stability for mounting structures.</li>
                <li><strong>Accessibility:</strong> Ensure the site is accessible for installation and maintenance.</li>
                <li><strong>Regulatory Compliance:</strong> Check local regulations and obtain necessary permits.</li>
                </ul>
            
              <img className="w-[400px] h-[466px] pt-5 mt-9 pl-10" src={image3} alt="Solar panel management illustration" />
            </div>
            </TextToSpeech>

          <TextToSpeech text="Regular Inspections:Conduct periodic visual inspections of solar panels to identify dirt accumulation, debris, or damage,Cleaning Guidelines: Clean solar panels using soft brushes or cloths and non-abrasive cleaning solutions to prevent scratches,Performance Monitoring:Utilize RISUN's visualization tools to monitor energy output and identify any anomalies in performance">

            <div  className="bg-yellow-200 text-[#101624] p-6 rounded-xl w-[610px] h-[500px] absolute top-[580px] transition-transform transform hover:scale-105 ">
              <h1 className='text-5xl font-bold'>Maintenance Tips</h1>
              <br />
              <ul className="list-disc pl-2 ">
                <li><strong>Regular Inspections:</strong> Conduct periodic visual inspections of solar panels to identify dirt accumulation, debris, or damage.</li>
                <li><strong>Cleaning Guidelines:</strong> Clean solar panels using soft brushes or cloths and non-abrasive cleaning solutions to prevent scratches.</li>
                <li> <strong>Performance Monitoring:</strong> Utilize RISUN's visualization tools to monitor energy output and identify any anomalies in performance.</li>
                </ul>
              <img className="w-[713px] h-[220px] mt-4" src={image2} alt="Solar panel management illustration" />
            </div>
          </TextToSpeech>
        </div>
         

          
          <div className="grid grid-cols-3 gap-x-6 gap-y-10 mt-5 relative">

          <TextToSpeech text="The content of this manual will be periodically updated to reflect new industry standards, technological advancements, and best practices. Stay informed by checking back regularly for the latest information">
            <div className="bg-yellow-200 text-[#101624] p-6 rounded-xl w-[500px] h-[600px] transition-transform transform hover:scale-105">
              <h1 className='text-5xl font-bold'>Update And Resources</h1>
              <br />
              <p>
                The content of this manual will be periodically updated to reflect new industry standards, technological advancements, and best practices. Stay informed by checking back regularly for the latest information.
              </p>
              <img className="w-[832px] h-[335px] mt-4" src={image4} alt="Solar panel management illustration" />
            </div>
            </TextToSpeech>

            <TextToSpeech text="Low Power Prediction Range,
                Range,500 to 1000 kWh/year per kW, typically found in areas with low solar irradiance (less than 4 kWh/m²/day),Moderate Power Prediction Range,
                Range, 1000 to 1500 kWh/year per kW, common in areas with moderate solar irradiance (4 to 5 kWh/m²/day),High Power Prediction Range,
              Range,1500 to 2500 kWh/year per kW, characteristic of areas with high solar irradiance (5 to 7 kWh/m²/day),Very High Power Prediction Range,
                Range,2500 to 7000 kWh/year per kW, found in exceptionally sunny regions with peak solar irradiance (above 7 kWh/m²/day)"> 
            <div className="bg-yellow-200 text-[#101624] p-6 rounded-xl w-[710px] h-[600px] absolute left-[520px] transition-transform transform hover:scale-105">
              <h1 className='text-5xl font-bold'>Power Prediction Ranges</h1>
              <br />
              <ul className="list-disc pl-2 ">
                <li><strong>Low Power Prediction Range:</strong><br />
                Range:500 to 1000 kWh/year per kW, typically found in areas with low solar irradiance (less than 4 kWh/m²/day).</li>
                <li><strong>Moderate Power Prediction Range:</strong> <br />
                Range:1000 to 1500 kWh/year per kW, common in areas with moderate solar irradiance (4 to 5 kWh/m²/day).</li>
              <li><strong>High Power Prediction Range:</strong><br />
              Range:1500 to 2500 kWh/year per kW, characteristic of areas with high solar irradiance (5 to 7 kWh/m²/day).</li>
                <li><strong>Very High Power Prediction Range:</strong><br />
                Range:2500 to 7000 kWh/year per kW, found in exceptionally sunny regions with peak solar irradiance (above 7 kWh/m²/day).</li>
              </ul>
              <br />
              <img className="w-[882px] h-[191px] mt-4" src={image5} alt="Solar panel management illustration" />
            </div>
            </TextToSpeech>

          </div>
      </div>


   
  );
};

export default UserManual;


import { useEffect } from "react";
import { benefits } from "../constants";
import Heading from "./Heading";
import Section from "./Section";
import { GradientLight } from "./design/Benefits";
import ClipPath from "../assets/svg/ClipPath";

const Benefits = () => {
  // Check if elements are in the viewport
  const checkVisibility = () => {
    const elements = document.querySelectorAll('.fade-in, .slide-in, .scale-in, .rotate-in');
    elements.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.classList.add('visible');
      }
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', checkVisibility);
    // Check on initial load if any elements are already in view
    checkVisibility();
    return () => {
      window.removeEventListener('scroll', checkVisibility);
    };
  }, []);

  return (
    <div>
      {/* Add the styles directly in the component */}
      <style jsx>{`
        /* Basic fade-in animation */
        .fade-in {
          opacity: 0;
          transform: translateY(50px);
          transition: opacity 1s ease-out, transform 1s ease-out;
        }

        .fade-in.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Hover effect for glowing yellow border */
        .border-glow {
          border: 4px solid #333; /* Default border color */
          transition: border 0.3s ease, box-shadow 0.3s ease;
        }

        .border-glow:hover {
          border-color: #FFD966; /* Yellow glow on hover */
          box-shadow: 0 0 10px #FFD966, 0 0 20px #FFD966; /* Glowing effect */
        }
        
        /* Slide-in animation */
        .slide-in {
          opacity: 0;
          transform: translateX(-100px);
          transition: opacity 1s ease-out, transform 1s ease-out;
        }

        .slide-in.visible {
          opacity: 1;
          transform: translateX(0);
        }

        /* Scale-in animation */
        .scale-in {
          opacity: 0;
          transform: scale(0.8);
          transition: opacity 1s ease-out, transform 1s ease-out;
        }

        .scale-in.visible {
          opacity: 1;
          transform: scale(1);
        }

        /* Rotate-in animation */
        .rotate-in {
          opacity: 0;
          transform: rotate(-45deg);
          transition: opacity 1s ease-out, transform 1s ease-out;
        }

        .rotate-in.visible {
          opacity: 1;
          transform: rotate(0);
        }
      `}</style>

      <Section id="features">
        <div className="container relative z-2 text-center py-12">
          {/* Centering the heading */}
          <Heading
            className="md:max-w-md lg:max-w-2xl mx-auto text-center"
            title={
              <span style={{ color: "#FFD966" }}>
                Optimize Solar Power Effortlessly with RISUN
              </span>
            }
          />

          <div className="flex flex-wrap gap-8 mb-5 justify-center">
            {/* Map over the benefits array and position cards conditionally */}
            {benefits.map((item, index) => (
              <div
                className={`block relative p-0.5 bg-no-repeat bg-[length:100%_100%] md:max-w-[24rem] fade-in ${
                  index >= benefits.length - 2 ? "flex-none" : ""
                }`}
                style={{
                  backgroundImage: `url(${item.backgroundUrl})`,
                  marginRight: index === benefits.length - 2 ? "0.5rem" : "0",
                }}
                key={item.id}
              >
                <div className="relative z-2 flex flex-col min-h-[22rem] p-[2.4rem] pointer-events-none">
                  {/* Circular bordered image with orange border */}
                  <div className="flex justify-center mb-5">
                    <div
                      className="w-28 h-28 rounded-full overflow-hidden border-glow"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <h5 className="h5 mb-5">{item.title}</h5>
                  <p className="body-2 mb-6 text-n-1">{item.text}</p>
                  <div className="flex items-center mt-auto"></div>
                </div>

                {item.light && <GradientLight />}

                <div
                  className="absolute inset-0.5 bg-n-8"
                  style={{ clipPath: "url(#benefits)" }}
                >
                  {/* Hover effect with lower opacity */}
                  <div className="absolute inset-0 opacity-0 transition-opacity hover:opacity-30">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        width={380}
                        height={362}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>

                <ClipPath />
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Benefits;
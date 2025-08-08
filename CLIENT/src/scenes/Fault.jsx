import React, { useState } from "react";
import styled from "styled-components";
import "./Fault.css";
import image1 from "../assets/fault/image-1 (1).jpeg";
import image3 from "../assets/fault/image-3.jpg";
import PropTypes from "prop-types";
import { fetchFaultPrediction } from "../helper/helper"; // Ensure this path is correct

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
`;

const UploadButton = styled.label.attrs({ className: 'specific-upload' })`
  display: inline-block;
  padding: 0.8rem 1.5rem;
  color: black;
  background-color: #D97706;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: transform 0.3s ease, background-color 0.3s ease;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #D97706;
    color: white;
    transform: scale(1.05);
  }
`;

const SubmitButton = styled.button`
  padding: 0.8rem 1.5rem;
  color: white;
  background-color: green;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
  transition: transform 0.3s ease, background-color 0.3s ease;
  border: none;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #FFA500;
    transform: scale(1.05);
  }
`;

const Input = styled.input`
  display: none;
`;

const Card = styled.div`
  margin-top: 2rem;
  padding: 3rem;
  width: 90%;
  max-width: 600px;
  min-height: 400px;
  background-color: #F8DF97;
  border-radius: 10px;
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.2);
  text-align: center;
  animation: fadeIn 0.6s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ImagePreview = styled.img`
  width: 100%;
  border-radius: 10px;
  margin-bottom: 2rem;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: black;
  font-weight: bold;
  font-size: 1.6rem;
`;

const Confidence = styled.p`
  font-size: 1.1rem;
  font-weight: bold;
  color: green;
  margin-top: 1rem;
`;

const Recommendations = styled.div`
  text-align: left;
  margin-top: 1rem;
  color: black;
  font-weight: bold;
  font-size: 1.2rem;
`;

const List = styled.ul`
  margin: 0.5rem 0;
  padding-left: 1.2rem;
  list-style-type: square;
  color: black;
`;

const ListItem = styled.li`
  font-size: 0.95rem;
  color: black;
`;
const Heading = styled.h1`
  color: white;
  font-weight: bold;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  animation: fadeInDown 0.5s ease-out;

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const StepContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
`;

const StepImage = styled.div`
  position: relative;
  text-align: center;
  margin: 0 1rem;

  img {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    border: 3px solid orange;
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }

  p {
    color: white;
    font-weight: bold;
    margin-top: 0.5rem;
  }
`;

const Arrow = styled.div`
  color: white;
  font-size: 2rem;
  margin: 0 1rem;
  transform: rotate(90deg);
  animation: bounce 1s infinite;

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0) rotate(90deg);
    }
    50% {
      transform: translateY(-10px) rotate(90deg);
    }
  }
`;

const InfoText = styled.div`
  color: red;
  font-weight: bold;
  margin-top: 1rem;
  text-align: center;
`;

const speakText = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };
const PredictionCard = ({
  image,
  faultType,
  confidence,
  recommendations,
  tips,
}) => (
  <Card>
    <ImagePreview src={image} alt="Uploaded" />
    <Title>Fault Type: {faultType}</Title>
    <Confidence>Confidence: {(confidence * 100).toFixed(2)}%</Confidence>
    <Recommendations>
      <h4>Recommendations:</h4>
      <List>
        {recommendations.map((item, index) => (
          <ListItem key={index}>{item}</ListItem>
        ))}
      </List>
      <h4>Tips:</h4>
      <List>
        {tips.map((tip, index) => (
          <ListItem key={index}>{tip}</ListItem>
        ))}
      </List>
    </Recommendations>
  </Card>
);

const Fault = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImage(URL.createObjectURL(file));
    setImageFile(file);
    setError(null);

    speakText("Image has been uploaded.");
  };

  const handleSubmit = async () => {
    if (!imageFile) {
      setError("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const response = await fetchFaultPrediction(formData);
      if (response) {
        setPredictionData({
          faultType: response.predicted_class,
          confidence: response.confidence,
          recommendations: response.recommendations || [],
          tips: response.tips || [],
        });
        speakText(`The fault type is ${response.predicted_class} with a confidence of ${(response.confidence * 100).toFixed(2)}%.`);
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (error) {
      console.error(error);
      setError("Prediction failed: " + (error.message || "Unknown error"));
    }
  };

  return (
    <Container>
      <Heading>Solar Panel Fault Prediction</Heading>
      <StepContainer>
        <StepImage>
          <img src={image1} alt="Step 1" />
          <p>Step 1: Upload Image</p>
        </StepImage>
        <Arrow>→</Arrow>
        <StepImage>
          <img src={image3} alt="Step 2" />
          <p>Step 2: Get Predictions</p>
        </StepImage>
      </StepContainer>
      <UploadButton htmlFor="file-upload">
        Upload Your Faulty Solar Panel Image
      </UploadButton>
      <Input
        type="file"
        id="file-upload"
        accept="image/*"
        onChange={handleImageChange}
      />
      {selectedImage && (
        <SubmitButton onClick={handleSubmit}>
          Submit for Prediction
        </SubmitButton>
      )}
      {error && <InfoText>{error}</InfoText>}
      {selectedImage && predictionData && (
        <PredictionCard
          image={selectedImage}
          faultType={predictionData.faultType}
          confidence={predictionData.confidence}
          recommendations={predictionData.recommendations}
          tips={predictionData.tips}
        />
      )}
    </Container>
  );
};

PredictionCard.propTypes = {
  image: PropTypes.string.isRequired,
  faultType: PropTypes.string.isRequired,
  confidence: PropTypes.number.isRequired,
  recommendations: PropTypes.arrayOf(PropTypes.string).isRequired,
  tips: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Fault;

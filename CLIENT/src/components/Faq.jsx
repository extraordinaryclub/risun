import React, { useState } from "react";

const FAQComponent = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const faqs = [
    {
      question: "What is RISUN and how does it work?",
      answer:
        "RISUN is a solar power management platform that helps optimize solar grid placement by analyzing key environmental factors such as solar elevation angles and weather conditions.",
    },
    {
      question: "How can RISUN help maximize energy output?",
      answer:
        "RISUN provides targeted recommendations for the best installation sites, enabling users to maximize energy output based on environmental parameters.",
    },
    {
      question: "What are the key features of RISUN?",
      answer:
        "Key features include heatmap visualization, power generation prediction, and fault detection for better grid management.",
    },
    {
      question: "Is RISUN suitable for large-scale projects?",
      answer:
        "Yes, RISUN is designed to support both small and large-scale solar grid projects with detailed insights for grid operators.",
    },
  ];

  const handleToggle = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  return (
    <div id="faq" style={styles.faqContainer}>
      {" "}
      {/* Added id="faq" */}
      <h1 style={styles.mainHeading}>RISUN: Frequently Asked Questions</h1>
      {faqs.map((faq, index) => (
        <div key={index} style={styles.faqItem}>
          <div style={styles.questionBox} onClick={() => handleToggle(index)}>
            <h3 style={styles.questionText}>{faq.question}</h3>
          </div>
          {expandedIndex === index && (
            <div style={styles.answerBox}>
              <p style={styles.answerText}>{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const styles = {
  faqContainer: {
    width: "80%",
    margin: "0 auto",
    paddingTop: "90px",
  },
  mainHeading: {
    color: "gold",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: "36px",
    marginBottom: "40px",
  },
  faqItem: {
    marginBottom: "20px",
  },
  questionBox: {
    backgroundColor: "darkorange",
    padding: "20px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  questionText: {
    color: "black",
    fontSize: "18px",
    fontWeight: "bold",
    margin: "0",
  },
  answerBox: {
    backgroundColor: "transparent",
    padding: "15px",
    borderRadius: "8px",
    marginTop: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  answerText: {
    color: "gold",
    fontSize: "16px",
  },
};

export default FAQComponent;
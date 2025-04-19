import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import '../../Styles/Faq.css';

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: "How does NearbyMedi work?",
      answer: "NearbyMedi allows you to search for medicines and find nearby pharmacies that have them in stock. Simply enter the medicine name and your location (or use GPS), and we'll show you where it's available."
    },
    {
      question: "Is the medicine availability information accurate?",
      answer: "We work directly with pharmacy partners to ensure our inventory data is as accurate and up-to-date as possible. Pharmacies update their stock information regularly throughout the day."
    },
    {
      question: "Do I need to create an account to use NearbyMedi?",
      answer: "No, you can search for medicines without creating an account. However, creating an account allows you to save favorite medicines and pharmacies for quicker access in the future."
    },
    {
      question: "Is NearbyMedi available in my city?",
      answer: "NearbyMedi is expanding rapidly. We currently serve major metropolitan areas and are continuously adding new regions. Enter your location to see if service is available in your area."
    },
    {
      question: "Can I get medicine delivered to my home?",
      answer: "NearbyMedi primarily helps you locate medicines at nearby pharmacies. Some of our partner pharmacies may offer delivery services. This will be indicated in their store information when available."
    },
    {
      question: "Is the service free to use?",
      answer: "Yes, NearbyMedi is completely free for users searching for medicine availability information."
    }
  ];

  return (
    <section id="faq" className="faq-section">
      <div className="container">
        <div className="section-header">
          <h2>Frequently Asked <span className="highlight">Questions</span></h2>
          <p className="section-subheading">
            Everything you need to know about NearbyMedi
          </p>
        </div>

        <div className="faq-container">
          {faqItems.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
              onClick={() => toggleFaq(index)}
            >
              <div className="faq-question">
                <h3>{faq.question}</h3>
                <div className="faq-icon">
                  {activeIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="faq-footer">
          <p>Still have questions?</p>
          <button className="contact-button">Contact Us</button>
        </div>
      </div>
    </section>
  );
};

export default Faq;

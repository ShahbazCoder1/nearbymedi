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
      answer: "NearByMedi instantly shows you which nearby pharmacies have your medicine in stock and are open—just enter the medicine name and your location or use GPS."
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
      answer: "NearByMedi is currently serving pharmacies and customers across West Bengal, bringing fast, reliable medicine availability right to your fingertips. We're excited to grow and expand to more regions soon—stay tuned."
    },
    {
      question: "Can I get medicine delivered to my home?",
      answer: "NearbyMedi primarily helps you locate medicines at nearby pharmacies. Some of our partner pharmacies may offer delivery services. This will be indicated in their store information when available."
    },
    {
      question: "Is the service free to use?",
      answer: "NearByMedi helps you find medicines at nearby pharmacies but does not handle deliveries. You can check the pharmacy's own website or contact them directly to see if delivery is available.."
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

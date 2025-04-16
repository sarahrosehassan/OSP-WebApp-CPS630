import React from 'react';
import Navbar from '../layout/Navbar';
import '../styles/about.css';
import Footer from '../layout/Footer';

const About = () => {
  return (
    <>
      <Navbar />
      <div className="about-body">
        <h1 className="about-title">Meet Our Developers</h1>
        <div className="team-container">
          <div className="team-member">
            <img src="/images/rijul.jpg" alt="Rijul Chadha" />
            <h3>Rijul Chadha</h3>
            <p>Backend & Database Specialist</p>
            <p>R1chadh@torontomu.ca</p>
          </div>

          <div className="team-member">
            <img src="/images/sarah.jpg" alt="Sarah Hassan" />
            <h3>Sarah Hassan</h3>
            <p>Frontend & UI/UX Designer</p>
            <p>sarahhassan@torontomu.ca</p>
          </div>

          <div className="team-member">
            <img src="/images/melissa.jpg" alt="Melissa Dela Cruz" />
            <h3>Melissa Dela Cruz</h3>
            <p>Full-Stack Developer</p>
            <p>melissa.delacruz@torontomu.ca</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { FaUsers, FaBriefcase, FaCalendarAlt } from 'react-icons/fa';
import './HomePage.css'; // --- THIS IS THE CHANGE ---

// --- Import Carousel CSS ---
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

function HomePage() { // --- RENAMED ---
  const { user } = useAuth(); 

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  const testimonials = [
    {
      quote: "This platform helped me land my first job. Connecting with senior gave me the guidance I needed.",
      name: "Rohan K.",
      role: "Software Engineer, Google",
      img: "https://placehold.co/100x100/e0e0e0/777?text=RK"
    },
    {
      quote: "As an alumni, it's incredibly rewarding to post job openings for current students. APSIT Connect makes it easy.",
      name: "Priya S.",
      role: "Project Manager, TCS",
      img: "https://placehold.co/100x100/e0e0e0/777?text=PS"
    },
    {
      quote: "The events and networking sessions are top-notch. I reconnected with three of my batchmates!",
      name: "Amit D.",
      role: "Data Scientist, Airoli",
      img: "https://placehold.co/100x100/e0e0e0/777?text=AD"
    }
  ];

  const companyLogos = [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1024px-Google_2015_logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/1024px-IBM_logo.svg.png",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBNCInPV5zWRSLE13auYs4pfiG9YFHrbrT7KpdAoKi3Z0MMsJf",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Infosys_logo.svg/1024px-Infosys_logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Wipro_Primary_Logo_Color_RGB.svg/1024px-Wipro_Primary_Logo_Color_RGB.svg.png",
    "https://www.capgemini.com/wp-content/uploads/2025/02/default-logo.webp"
  ];

  return (
    <div className="dashboard-page-new">
      
      <div className="dashboard-hero">
        <h1 className="hero-title">Welcome, <span className="hero-name">{user.name}!</span></h1>
        <p className="hero-subtitle">You are now connected to the APSIT Alumni Network.</p>
      </div>

      <div className="feature-cards">
        <Link to="/network" className="feature-card">
          <div className="feature-icon">
            <FaUsers />
          </div>
          <h3>Connect with Alumni</h3>
          <p>Browse the network, find mentors, and build connections.</p>
        </Link>

        <Link to="/jobs" className="feature-card">
          <div className="feature-icon">
            <FaBriefcase />
          </div>
          <h3>Career Opportunities</h3>
          <p>Discover job openings posted by fellow alumni.</p>
        </Link>

        <Link to="/events" className="feature-card">
          <div className="feature-icon">
            <FaCalendarAlt />
          </div>
          <h3>Events & Networking</h3>
          <p>Join webinars, workshops, and meetups.</p>
        </Link>
      </div>

      <div className="success-stories">
        <h2>Success Stories</h2>
        <Slider {...carouselSettings}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <img src={testimonial.img} alt={testimonial.name} />
              <blockquote>"{testimonial.quote}"</blockquote>
              <h4>{testimonial.name}</h4>
              <p>{testimonial.role}</p>
            </div>
          ))}
        </Slider>
      </div>

      <div className="company-logos">
        <h2>Where Our Alumni Work</h2>
        <div className="logo-grid">
          {companyLogos.map((logo, index) => (
            <div key={index} className="logo-card">
              <img src={logo} alt="Company Logo" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage; // --- RENAMED ---
import React from "react";
import { Container } from "react-bootstrap";

const PartnerProgramHero = () => {
  return (
    <Container className="py-5">
      <h1 className="display-5 fw-bold text-center">Partner Program</h1>
      <div className="w-75 mx-auto">
        <p className="lead">
          Our Partner Program is designed for professionals and businesses in the dance and event industry who want to take their offerings to the next level. Whether you’re a teacher looking to manage classes, a DJ seeking more gigs, a venue wanting to reward loyal customers, or a supplier interested in selling merchandise, our platform is built to support your needs.
        </p>
        <p className="lead">
          Teachers can effortlessly manage class schedules and bookings, while DJs can find and manage gigs with ease. Venues can engage with their customers through loyalty programs, and event coordinators can create and manage events with multiple ticket types. Suppliers can open a shop and sell directly to dancers and event-goers.
        </p>
        <p className="lead">
          The Partner Program is for anyone who plays a vital role in creating unforgettable dance experiences. Join us and grow your business with our comprehensive tools for class management, event organization, sales, and customer engagement.
        </p>
      </div>
    </Container>
  );
};

export default PartnerProgramHero;

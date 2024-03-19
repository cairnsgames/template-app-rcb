import React from "react";
import PageWrapper from "../../parts/pagewrapper";
import Header from "./header";
import Footer from "./footer";
import Post from "./post";
import { Container } from "react-bootstrap";
import "./instaclone.scss";

const InstaClone = () => {
  return (
    <PageWrapper className="wrapper">
      <Header />
      <Container
        fluid
        className="scrolling-body p-0 pe-2"
        style={{ marginBottom: "64px" }}
      >
        <Post video="https://www.youtube.com/embed/il_t1WVLNxk" />
        <Post
          ownerType="event"
          src="https://images.unsplash.com/photo-1682685797886-79020b7462a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        />
        <Post />
        <Post />
      </Container>
      <Footer />
    </PageWrapper>
  );
};

export default InstaClone;

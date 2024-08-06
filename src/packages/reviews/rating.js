import React, { useState, useEffect } from "react";
import { Row, Col, Button, Modal, Form } from "react-bootstrap";
import Stars from "./stars";
import { useUser } from "../auth/context/useuser";
import { useTenant } from "../tenant/context/usetenant";

const Rating = (props) => {
  const { type, id } = props;
  const { user, token } = useUser();
  const { tenant } = useTenant();
  const [data, setData] = useState();

  if (!process.env.REACT_APP_REVIEW_API) {
    console.error("REACT_APP_REVIEW_API not defined");
    return <div>Reviews are not enabled yet</div>;
  }

  const enabled = type && id && user;

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_REVIEW_API}/getreviews.php?type=${type}&id=${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          APP_ID: tenant,
          token: token,
        },
      }
    ).then((res) => res.json())
      .then((data) => {
        setData(data);
      })
  }, [token]);

  return (
    <Stars number={data?.average?.rating} />
  );
};

export default Rating;

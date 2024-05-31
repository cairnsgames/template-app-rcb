import React, { useState, useEffect } from "react";
import { Row, Col, Button, Modal, Form } from "react-bootstrap";
import Stars from "./stars";
import { useUser } from "../auth/context/useuser";
import { useTenant } from "../tenant/context/usetenant";

const Reviews = (props) => {
  const { type, id } = props;
  const ratings = [1, 2, 3, 4, 5];
  const [rating, setrating] = useState(0);
  const [review, setreview] = useState("");
  const [add, setadd] = useState(false);
  const { user, token } = useUser();
  const { tenant } = useTenant();
  const [data, setData] = useState();

  console.log("REVIEWS,", user, token);

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

  const doAdd = () => {
    if (rating === 0) {
      return;
    }
    const body = {
      id: user.id,
      teacher: props.data.id,
      type: props.type,
      rating: rating,
      review: review,
    };
    // console.log("Body!!",body)
    fetch(`${process.env.REACT_APP_REVIEW_API}/addreview.php`, {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        APP_ID: tenant,
        token: token,
      },
      body: JSON.stringify(body),
    }).then((res) => refetch());
    setadd(false);
  };

  return (
    <Row>
      <Col xs={12}>
        <div className="d-grid gap-2">
          {id !== user?.id && (
            <Button
              disabled={!enabled}
              onClick={() => {
                setadd(true);
              }}
            >
              {data?.myreview ? "Update your Review" : "Add your Review"}
              
              {user?.id ? null : (
                <span style={{ fontSize: "12px" }}>
                  <br />
                  Log in to add your review
                </span>
              )}
            </Button>
          )}
        </div>
      </Col>
      <Col xs={12}>
        {data?.reviews?.map((item, index) => {
          return (
            <Row
              key={item.id || index}
              className="m-2 pt-2 pb-2"
              style={{ border: "1px solid lightgrey", borderRadius: "10px" }}
            >
              <Col xs={7}>{item.firstname} {item.lastname}</Col>
              <Col xs={5}>
                <Stars number={item.stars} />
              </Col>
              <Col style={{ borderTop: "1px solid lightgrey" }} xs={12}>
                {item.text}
              </Col>
            </Row>
          );
        })}
      </Col>
      <Modal show={add}>
        <Modal.Header>
          <Modal.Title>Add Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Star rating</Form.Label>
              <br />
              <Form.Text>
                Please provide a star rating from 1=worst to 5=best
              </Form.Text>
              <br />
              {ratings.map((id) => {
                return (
                  <Form.Check
                    inline
                    label={id}
                    name="group1"
                    type="Radio"
                    id={`reverse-${id}`}
                    key={id}
                    value={rating}
                    onChange={() => {
                      setrating(id);
                    }}
                  />
                );
              })}
            </Form.Group>
            <br />
            <Form.Group className="mb-3" controlId="reviewText">
              <Form.Label>Enter your review</Form.Label>
              <Form.Control
                as="textarea"
                type="text"
                placeholder="Enter your review"
                value={review}
                onChange={(e) => setreview(e.target.value)}
              />
              <Form.Text>Please give a detailed review</Form.Text>
              <br />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {rating > 0 ? (
            <Button onClick={() => doAdd()}>Add</Button>
          ) : (
            <Button disabled>Add</Button>
          )}
          <Button
            variant="outline-primary"
            onClick={() => {
              setadd(false);
            }}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Row>
  );
};

export default Reviews;

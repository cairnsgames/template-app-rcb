import React from 'react';
import { Container, Table, Card, Row, Col } from "react-bootstrap";
import { Check } from 'react-bootstrap-icons';

const ExamplePricing = () => {
    return (<Container>
    <header>
      <div className="pricing-header p-3 pb-md-4 mx-auto text-center">
        <h1 className="display-4 fw-normal">Pricing</h1>
        <p className="fs-5 text-muted">Quickly build an effective pricing table for your potential customers with this Bootstrap example. It’s built with default Bootstrap components and utilities with little customization.</p>
      </div>
    </header>
  
    <main>
      <Row md={3} className="text-center">
        <Col>
          <Card>
            <Card.Header className="py-3">
              <h4 className="my-0 fw-normal">Free</h4>
            </Card.Header>
            <Card.Body>
              <h1 className="card-title pricing-card-title">$0<small className="text-muted fw-light">/mo</small></h1>
              <ul className="list-unstyled mt-3 mb-4">
                <li>10 users included</li>
                <li>2 GB of storage</li>
                <li>Email support</li>
                <li>Help center access</li>
              </ul>
              <button type="button" className="w-100 btn btn-lg btn-outline-primary">Sign up for free</button>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Header className="py-3">
              <h4 className="my-0 fw-normal">Pro</h4>
            </Card.Header>
            <Card.Body>
              <h1 className="card-title pricing-card-title">$15<small className="text-muted fw-light">/mo</small></h1>
              <ul className="list-unstyled mt-3 mb-4">
                <li>20 users included</li>
                <li>10 GB of storage</li>
                <li>Priority email support</li>
                <li>Help center access</li>
              </ul>
              <button type="button" className="w-100 btn btn-lg btn-primary">Get started</button>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="shadow-sm border-primary">
            <Card.Header className="py-3 text-white bg-primary border-primary">
              <h4 className="my-0 fw-normal">Enterprise</h4>
            </Card.Header>
            <Card.Body>
              <h1 className="card-title pricing-card-title">$29<small className="text-muted fw-light">/mo</small></h1>
              <ul className="list-unstyled mt-3 mb-4">
                <li>30 users included</li>
                <li>15 GB of storage</li>
                <li>Phone and email support</li>
                <li>Help center access</li>
              </ul>
              <button type="button" className="w-100 btn btn-lg btn-primary">Contact us</button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
  
      <h2 className="display-6 text-center mb-4">Compare plans</h2>
  
      <div className="table-responsive">
        <Table className="table text-center">
          <thead>
            <tr>
              <th style={{width: "34%"}}></th>
              <th style={{width: "22%"}}>Free</th>
              <th style={{width: "22%"}}>Pro</th>
              <th style={{width: "22%;"}}>Enterprise</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" className="text-start">Public</th>
              <td><Check /></td>
              <td><Check /></td>
              <td><Check /></td>
            </tr>
            <tr>
              <th scope="row" className="text-start">Private</th>
              <td></td>
              <td><Check /></td>
              <td><Check /></td>
            </tr>
          </tbody>
  
          <tbody>
            <tr>
              <th scope="row" className="text-start">Permissions</th>
              <td><Check /></td>
              <td><Check /></td>
              <td><Check /></td>
            </tr>
            <tr>
              <th scope="row" className="text-start">Sharing</th>
              <td></td>
              <td><Check /></td>
              <td><Check /></td>
            </tr>
            <tr>
              <th scope="row" className="text-start">Unlimited members</th>
              <td></td>
              <td><Check /></td>
              <td><Check /></td>
            </tr>
            <tr>
              <th scope="row" className="text-start">Extra security</th>
              <td></td>
              <td></td>
              <td><Check /></td>
            </tr>
          </tbody>
        </Table>
      </div>
    </main>

    </Container>)

}

export default ExamplePricing;
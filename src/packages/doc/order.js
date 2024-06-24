import React from "react";
import { Container, Row, Col, Table, Button, Image } from "react-bootstrap";
import { jsPDF } from "jspdf";

export const orderData = {
  id: "12345",
  company: {
    name: "Best Products Inc.",
    phone: "123-456-7890",
    address: "456 Commerce Rd, Marketville, ST 67890",
    logo: "favicon.png", // replace with actual URL
  },
  customer: {
    name: "John Doe",
    email: "john.doe@example.com",
    address: "123 Main St, Cityville, ST 12345",
  },
  products: [
    {
      id: "prod1",
      name: "Product 1",
      quantity: 2,
      price: 19.99,
      promoCode: "SAVE5",
      discount: 0.05,
    },
    {
      id: "prod2",
      name: "Product 2",
      quantity: 1,
      price: 49.99,
      promoCode: "SAVE5",
      discount: 0.05,
    },
  ],
  totalPrice: 89.97,
  date: "2024-05-17",
};

const calculateDiscountedPrice = (price, discount) => {
  return price - price * discount;
};

const OrderSummary = ({ order }) => {
  console.log("#### Order Summary", order);

  const handlePrint = () => {
    const doc = new jsPDF();
    doc.addImage(order.company.logo, "JPEG", 10, 10, 30, 30);

    // Add company name
    doc.setFontSize(16);
    doc.text(order.company.name, 65, 20, { align: "left" });

    // Add company phone and address
    doc.setFontSize(12);
    doc.text(order.company.phone, 65, 28, { align: "left" });
    doc.text(order.company.address, 65, 36, { align: "left" });

    doc.setFontSize(16);
    doc.text("Order Summary", 20, 50);
    doc.setFontSize(12);
    doc.text(`Order ID: ${order.id}`, 20, 60);
    doc.text(`Customer: ${order.customer.name}`, 20, 70);
    doc.text(`Email: ${order.customer.email}`, 20, 80);
    doc.text(`Address: ${order.customer.address}`, 20, 90);
    doc.text(`Date: ${order.date}`, 20, 100);

    let y = 130;
    doc.setFont(undefined, "bold");
    doc.text("Product", 20, y);
    doc.text("Quantity", 60, y);
    doc.text("Price", 90, y);
    doc.text("Promo Code", 120, y);
    doc.text("Final Price", 150, y);
    doc.setFont(undefined, "normal");
    y += 10;
    order.products.forEach((product) => {
      const discountedPrice = calculateDiscountedPrice(
        product.price,
        product.discount
      ).toFixed(2);
      doc.text(product.name, 20, y);
      doc.text(`${product.quantity}`, 70, y);
      doc.text(`$${product.price}`, 110, y, "right");
      doc.text(`${product.promoCode}`, 120, y);
      doc.text(`$${discountedPrice * product.quantity}`, 180, y, "right");
      y += 10;
    });
    doc.line(130, y - 5, 180, y - 5);
    doc.text(`Total Price: $${order.totalPrice}`, 180, y, "right");

    doc.save("order-summary.pdf");
  };

  return (
    <Container>
      <Row>
        <Col>
          <Row className="align-items-center mb-4">
            <Col xs="auto">
              <Image
                src={order.company.logo}
                rounded
                style={{ width: "100px" }}
              />
            </Col>
            <Col>
              <h1>{order.company.name}</h1>
              <p>{order.company.phone}</p>
              <p>{order.company.address}</p>
            </Col>
          </Row>
          <h2>Order Summary</h2>
          <p>
            <strong>Order ID:</strong> {order.id}
          </p>
          <p>
            <strong>Customer:</strong> {order.customer.name}
          </p>
          <p>
            <strong>Email:</strong> {order.customer.email}
          </p>
          <p>
            <strong>Address:</strong> {order.customer.address}
          </p>
          <p>
            <strong>Date:</strong> {order.date}
          </p>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Promo Code</th>
                <th>Discounted Price</th>
              </tr>
            </thead>
            <tbody>
              {order.products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.quantity}</td>
                  <td>${product.price}</td>
                  <td>{product.promoCode}</td>
                  <td>
                    $
                    {calculateDiscountedPrice(
                      product.price,
                      product.discount
                    ).toFixed(2) * product.quantity}
                  </td>
                </tr>
              ))}
              <tr>
                <td colspan={3}></td>
                <td>
                  <strong>Total Price:</strong>
                </td>
                <td>
                  <strong>${order.totalPrice}</strong>
                </td>
              </tr>
            </tbody>
          </Table>
          <Button onClick={handlePrint}>Print as PDF</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderSummary;

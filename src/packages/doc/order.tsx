import React from "react";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import { jsPDF } from "jspdf";

type OrderProduct = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  promoCode: string;
  discount: number;
};

type OrderCompany = {
  name: string;
  phone: string;
  address: string;
  logo: string;
};

type OrderCustomer = {
  name: string;
  email: string;
  address: string;
};

type Order = {
  id: string;
  company: OrderCompany;
  customer: OrderCustomer;
  products: OrderProduct[];
  totalPrice: number;
  date: string;
};

export const orderData: Order = {
  id: "12345",
  company: {
    name: "Best Products Inc.",
    phone: "123-456-7890",
    address: "456 Commerce Rd, Marketville, ST 67890",
    logo: "favicon.png",
  },
  customer: {
    name: "John Doe",
    email: "john.doe@example.com",
    address: "123 Main St, Cityville, ST 12345",
  },
  products: [
    { id: "prod1", name: "Product 1", quantity: 2, price: 19.99, promoCode: "SAVE5", discount: 0.05 },
    { id: "prod2", name: "Product 2", quantity: 1, price: 49.99, promoCode: "SAVE5", discount: 0.05 },
  ],
  totalPrice: 89.97,
  date: "2024-05-17",
};

const calculateDiscountedPrice = (price: number, discount: number): number =>
  price - price * discount;

type OrderSummaryProps = {
  order: Order;
};

const OrderSummary = ({ order }: OrderSummaryProps) => {
  const handlePrint = () => {
    const doc = new jsPDF();
    doc.addImage(order.company.logo, "JPEG", 10, 10, 30, 30);
    doc.setFontSize(16);
    doc.text(order.company.name, 65, 20, { align: "left" });
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
    doc.setFont("helvetica", "bold");
    doc.text("Product", 20, y);
    doc.text("Quantity", 60, y);
    doc.text("Price", 90, y);
    doc.text("Promo Code", 120, y);
    doc.text("Final Price", 150, y);
    doc.setFont("helvetica", "normal");
    y += 10;
    order.products.forEach((product) => {
      const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
      doc.text(product.name, 20, y);
      doc.text(`${product.quantity}`, 60, y);
      doc.text(`$${product.price}`, 90, y);
      doc.text(product.promoCode, 120, y);
      doc.text(`$${discountedPrice.toFixed(2)}`, 150, y);
      y += 10;
    });
    doc.save("order.pdf");
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>Order Summary</h1>
          <p>Order ID: {order.id}</p>
          <p>Customer: {order.customer.name}</p>
          <p>Email: {order.customer.email}</p>
          <p>Address: {order.customer.address}</p>
          <p>Date: {order.date}</p>
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
                    ${(calculateDiscountedPrice(product.price, product.discount) * product.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={3}></td>
                <td><strong>Total Price:</strong></td>
                <td><strong>${order.totalPrice}</strong></td>
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

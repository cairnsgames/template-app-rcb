import React from "react";
import { Button, Form } from "react-bootstrap";
import { Plus, Trash } from "react-bootstrap-icons";

const TicketLines = ({ header, lines, setLines, FormText }) => {
  return (
    <div className="mt-3">
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="text-muted">{header}</h4>
        
        <Button
          variant="outline-primary"
          onClick={() =>
            setLines([
              ...lines,
              { description: "", currency: "ZAR", price: "" },
            ])
          }
        >
          <Plus />
        </Button>
      </div>
        <Form.Text className="ms-3">{FormText}</Form.Text>

      <table className="table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Currency</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line, index) => (
            <tr key={index}>
              <td>
                <Form.Control
                  type="text"
                  value={line.name}
                  onChange={(e) => {
                    const updatedLines = [...lines];
                    updatedLines[index].name = e.target.value;
                    setLines(updatedLines);
                  }}
                />
              </td>
              <td>
                <Form.Select
                  value={line.currency}
                  onChange={(e) => {
                    const updatedLines = [...lines];
                    updatedLines[index].currency = e.target.value;
                    setLines(updatedLines);
                  }}
                >
                  <option value="ZAR">ZAR</option>
                  <option value="USD">USD</option>
                </Form.Select>
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={line.price}
                  onChange={(e) => {
                    const updatedLines = [...lines];
                    updatedLines[index].price = e.target.value;
                    setLines(updatedLines);
                  }}
                />
              </td>
              <td>
                <Button
                  variant="outline-danger"
                  onClick={() => {
                    const updatedLines = lines.filter(
                      (_, i) => i !== index
                    );
                    setLines(updatedLines);
                  }}
                >
                  <Trash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketLines;

import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import CustomFormControl from "./element";
import { Container } from "react-bootstrap";

const CustomForm = (props) => {
  const { config, values, onSubmit } = props;
  const [validated, setValidated] = useState(false);
  const [fieldValues, setFieldValues] = useState({});

  const validFieldTypes = [
    "checkbox",
    "check",
    "radio",
    "radiogroup",
    "tel",
    "email",
    "textarea",
    "text",
    "password",
    "label",
    "select",
    "layout",
  ];

  useEffect(() => {
    if (!onSubmit) {
      throw new Error("A form needs an onSubmit handler");
    }
    if (!config) {
      throw new Error("A form needs a configuration");
    }
  }, []);

  useEffect(() => {
    const newValues = { ...fieldValues };
    config.fields.map((field) => {
      if (!validFieldTypes.includes(field.type)) {
        throw new Error("Invalid field type", field.type);
      }
      if (field.type === "checkbox") {
        newValues[field.name] = values[field.name] ?? false;
      } else {
        newValues[field.name] = values[field.name] ?? "";
      }
    });
    setFieldValues(newValues);
  }, [config, values]);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    propTypes.onSubmit(fieldValues);
  };

  useEffect(() => {
  }, [fieldValues]);

  const changeFieldValue = (e, field) => {
    const newValues = { ...fieldValues };
    if (field.type === "checkbox") {
      newValues[field.name] = e.target.checked;
    } else {
      newValues[field.name] = e.target.value;
    }
    setFieldValues(newValues);
  };

  return (
    <Container>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row>
          {config.fields.map((field, index) => {
            return (
              <CustomFormControl
                key={field.id ?? field.name}
                {...field}
                value={fieldValues[field.name] ?? ""}
                onChange={(e) => {
                  changeFieldValue(e, field);
                  if (field.onChange) {
                    field.onChange(e);
                  }
                }}
              />
            );
          })}
        </Row>
        <Row className="mt-2">
          <Button type="submit">Submit form</Button>
        </Row>
      </Form>
    </Container>
  );
};

export default CustomForm;

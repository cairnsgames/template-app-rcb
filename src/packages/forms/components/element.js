import React from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

const buildProps = (props) => {
  const prop = {};
  if (props.as) {
    prop.as = props.as;
  }
  if (props.xs) {
    prop.xs = props.xs;
  }
  if (props.sm) {
    prop.sm = props.sm;
  }
  if (props.md) {
    prop.md = props.md;
  }
  if (props.lg) {
    prop.lg = props.lg;
  }
  if (props.xl) {
    prop.xl = props.xl;
  }
  if (props.className) {
    prop.className = props.className;
  }
  if (props.style) {
    prop.style = props.style;
  }
  return prop;
};

const buildControlProps = (props) => {
  const prop = {};
  if (props.type) {
    prop.type = props.type;
  }
  if (props.required) {
    prop.required = props.required;
  }
  if (props.placeholder) {
    prop.placeholder = props.placeholder;
  }
  prop.label = props.label ?? props.name;
  if (props.defaultValue) {
    prop.defaultValue = props.defaultValue;
  }
  if (props.feedbackType) {
    prop.feedbackType = props.feedbackType;
  }
  if (props.feedback) {
    prop.feedback = props.feedback;
  }
  if (props.invalid) {
    prop.invalid = props.invalid;
  }
  if (props.valid) {
    prop.valid = props.valid;
  }
  if (props.type === "checkbox") {
    prop.checked = props.value;
    // prop.value = props.value ? "on" : "off";
  } else {
    prop.value = props.value;
  }
  if (props.onChange) {
    prop.onChange = props.onChange;
  }
  return prop;
};

const CustomFormControlInput = (props) => {
  return (
    <Form.Group {...buildProps(props)}>
      <Form.Label>{props.label ?? props.name}</Form.Label>
      <Form.Control {...buildControlProps(props)} />
      <Form.Control.Feedback>
        {props.valid ?? "Looks good!"}
      </Form.Control.Feedback>
      <Form.Control.Feedback type="invalid">
        {props.invalid ?? "Please complete this field correctly"}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

const CustomFormControlCheck = (props) => {
  const { onChange, ...prop } = props;
  return (
    <Form.Group as={Col} {...buildProps(props)}>
      <Form.Check {...prop} />
    </Form.Group>
  );
};

const CustomFormControlLabel = (props) => {
  const { onChange, ...prop } = props;
  return (
    <Form.Group as={Col} {...buildProps(props)}>
      <div>{props.label}</div>
    </Form.Group>
  );
};

const CustomFormControlSelect = (props) => {
  const { ...prop } = props;
  return (
    <Form.Group as={Col} {...buildProps(props)}>
      SELECT
      <Form.Select {...prop}>
        {props.options.map((option) => {
          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </Form.Select>
    </Form.Group>
  );
};

const CustomFormControlTextArea = (props) => {
  if (props.as) {
    throw new Error("Text area does not support the 'as' prop");
  }
  return (
    <Form.Group {...buildProps(props)}>
      <Form.Label>{props.label ?? props.name}</Form.Label>
      <Form.Control as="textarea" {...buildControlProps(props)} />
      <Form.Control.Feedback>
        {props.valid ?? "Looks good!"}
      </Form.Control.Feedback>
      <Form.Control.Feedback type="invalid">
        {props.invalid ?? "Please complete this field correctly"}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

const CustomFormControl = (props) => {
  if (["text", "tel", "email", "password"].includes(props.type)) {
    return <CustomFormControlInput {...props} />;
  }
  if (["check", "checkbox"].includes(props.type)) {
    return <CustomFormControlCheck {...props} type="check" />;
  }
  if (["radio", "radiogroup"].includes(props.type)) {
    return <CustomFormControlCheck {...props} />;
  }
  if (["textarea"].includes(props.type)) {
    return <CustomFormControlTextArea {...props} />;
  }
  if (["label"].includes(props.type)) {
    return <CustomFormControlLabel {...props} />;
  }
  if (["select"].includes(props.type)) {
    return <CustomFormControlSelect {...props} />;
  }
  if (["layout"].includes(props.type)) {
    const prop = buildProps(props);
    return (
      <Row {...prop}>
        {props.fields.map((field) => {
          return <CustomFormControl key={field.id ?? field.name} {...field} />;
        })}
      </Row>
    );
  }
};

export default CustomFormControl;

import React, { useState } from "react";
import { Form } from "../../packages/forms";
import PageFull from "../../parts/pagelayouts/pagefull";

const FormPage = ({ id }) => {
  const [values, setvalues] = useState({ password: "1111" });

  const config = {
    fields: [
      {
        name: "name",
        label: "Name",
        type: "text",
        placeholder: "Enter your name",
        required: true,
      },
      {
        name: "surname",
        label: "Surname",
        type: "text",
        placeholder: "Enter your name",
        required: true,
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "Enter your email",
        required: true,
        invalid: "Please enter a valid email address",
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "Enter your password",
        required: true,
      },
      {
        name: "textarea",
        label: "Text Area",
        type: "textarea",
        placeholder: "Please tell us a bit about you",
        required: true,
        xs: 12,
        lg: 4,
      },
      {
        name: "confirm",
        label: "Agree to terms and conditions",
        type: "check",
        required: true,
        invalid: "You need to agree to the terms and conditions",
        xs: 12,
      },

      {
        name: "layout",
        type: "layout",
        xs: 12,
        lg: 8,
        style: { border: "1px solid green", borderRadius: "5px" },
        className: "mx-2 p-2",
        fields: [
          {
            name: "label1",
            label: "This is a label field, used as a header for the radios",
            type: "label",
            xs: 12,
          },
          {
            id: "radio1",
            name: "radios",
            label: "Radio 1",
            type: "radio",
            required: true,
            invalid: "You need to agree to the terms and conditions",
          },
          {
            id: "radio2",
            name: "radios",
            label: "Radio 2",
            type: "radio",
            required: true,
            invalid: "You need to agree to the terms and conditions",
          },
        ],
      },
      {
        name: "select",
        label: "Select",
        type: "select",
        required: true,
        invalid: "You need to choose form the options",
        options: [
          { value: "1", label: "Option 1" },
          { value: "2", label: "Option 2" },
        ],
        xs: 12,
      },
    ],
  };

  const formSubmit = (fieldValues) => {
    setvalues(fieldValues);
  };
  return (
    <PageFull className="p-2">
      <h1>Form Page</h1>
      <Form config={config} values={values} onSubmit={formSubmit} />
    </PageFull>
  );
};

export default FormPage;

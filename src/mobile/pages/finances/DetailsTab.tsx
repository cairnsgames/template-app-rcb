import React, { useContext, useEffect, useState } from "react";
import { Card, Form, Spinner, Button } from "react-bootstrap";
import { TxContext } from "./txContext";
import { TxContextValue } from "./finances.types";
import useUser from "@cairnsgames/auth/context/useuser";
import { Save } from "react-bootstrap-icons";
import Property from "../../../packages/profile/types/property.type";

export default function DetailsTab(): JSX.Element {
  const tx = useContext(TxContext) as TxContextValue;
  const { vatOwed, loadingBalances } = tx || ({} as TxContextValue);
  const { properties = [], saveProperties } = useUser();

  const [mergedProperties, setMergedProperties] = useState<Property[]>([]);
  const [vatNumber, setVatNumber] = useState<string>("");
  const [notVatRegistered, setNotVatRegistered] = useState<boolean>(false);
  const [bankDetails, setBankDetails] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
    sortCode: "",
  });

  function updateBank(field: string, value: string) {
    setBankDetails((b) => ({ ...b, [field]: value }));
    setMergedProperties((prev) => {
      const cp = [...prev];
      const idx = cp.findIndex((p) => p.name === "bank details");
      if (idx > -1) {
        cp[idx] = { ...cp[idx], value: JSON.stringify({ ...bankDetails, [field]: value }) } as Property;
      }
      return cp;
    });
  }

  useEffect(() => {
    const defaultProperties: Property[] = [
      { name: "vat number", value: "", type: "text" },
      { name: "bank details", value: "", type: "json" },
    ];

    const updatedProperties = defaultProperties.map((defaultProp) => {
      const existingProp = properties.find((prop: Property) => prop.name === defaultProp.name);
      if (existingProp) {
        return { ...defaultProp, ...existingProp } as Property;
      }
      return defaultProp as Property;
    });

    setMergedProperties(updatedProperties);

    // initialize VAT and bank details derived state
    const vatProp = updatedProperties.find((p) => p.name === "vat number");
    if (vatProp) {
      if (vatProp.value === "NO VAT") {
        setNotVatRegistered(true);
        setVatNumber("");
      } else {
        setNotVatRegistered(false);
        setVatNumber(vatProp.value || "");
      }
    }

    const bankProp = updatedProperties.find((p) => p.name === "bank details");
    if (bankProp && bankProp.value) {
      try {
        const parsed = typeof bankProp.value === "string" ? JSON.parse(bankProp.value) : bankProp.value;
        setBankDetails({
          accountName: parsed.accountName || "",
          accountNumber: parsed.accountNumber || "",
          bankName: parsed.bankName || "",
          sortCode: parsed.sortCode || "",
        });
      } catch (e) {
        setBankDetails({ accountName: "", accountNumber: "", bankName: "", sortCode: "" });
      }
    }
  }, [properties]);

  if (loadingBalances)
    return (
      <div className="text-center py-3">
        <Spinner animation="border" />
      </div>
    );

  return (
    <div>
      <h4>Account Details</h4>
      <div className="mb-3">VAT owed: <strong>R{vatOwed}</strong></div>

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>VAT registration</Form.Label>
          <Form.Check
            type="checkbox"
            label="I am not VAT registered"
            id="notVat"
            checked={notVatRegistered}
            onChange={(e) => {
              const checked = e.target.checked;
              setNotVatRegistered(checked);
              setMergedProperties((prev) => {
                const cp = [...prev];
                const idx = cp.findIndex((p) => p.name === "vat number");
                if (idx > -1) {
                  cp[idx] = { ...cp[idx], value: checked ? "NO VAT" : vatNumber } as Property;
                }
                return cp;
              });
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Control
            placeholder="VAT number"
            value={vatNumber}
            onChange={(e) => {
              setVatNumber(e.target.value);
              setMergedProperties((prev) => {
                const cp = [...prev];
                const idx = cp.findIndex((p) => p.name === "vat number");
                if (idx > -1) {
                  cp[idx] = { ...cp[idx], value: e.target.value } as Property;
                }
                return cp;
              });
            }}
            disabled={notVatRegistered}
          />
        </Form.Group>

        <Card className="mb-3">
          <Card.Body>
            <Card.Title>Banking details</Card.Title>
            <Form.Group className="mb-2">
              <Form.Label>Account name</Form.Label>
              <Form.Control
                placeholder="Account name"
                value={bankDetails.accountName}
                onChange={(e) => updateBank("accountName", e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Account number</Form.Label>
              <Form.Control
                placeholder="Account number"
                value={bankDetails.accountNumber}
                onChange={(e) => updateBank("accountNumber", e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Bank name</Form.Label>
              <Form.Control
                placeholder="Bank name"
                value={bankDetails.bankName}
                onChange={(e) => updateBank("bankName", e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Sort code</Form.Label>
              <Form.Control
                placeholder="Sort code"
                value={bankDetails.sortCode}
                onChange={(e) => updateBank("sortCode", e.target.value)}
              />
            </Form.Group>
          </Card.Body>
        </Card>

        <Button
          variant="primary"
          onClick={() => {
            const updated = mergedProperties.map((p) => {
              if (p.name === "vat number") {
                return { ...p, value: notVatRegistered ? "NO VAT" : vatNumber } as Property;
              }
              if (p.name === "bank details") {
                return { ...p, value: JSON.stringify(bankDetails) } as Property;
              }
              return p;
            });
            saveProperties(updated);
            setMergedProperties(updated);
          }}
        >
          <Save className="me-2" /> Save
        </Button>
      </Form>
    </div>
  );
}

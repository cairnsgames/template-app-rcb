import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Tabs, Tab, Table } from 'react-bootstrap';
import { useAPITest } from '../../packages/apitest/provider';
const EditCallForm = () => {
  const {
    selectedCall,
    createOrUpdateCall,
    executeCall,
  } = useAPITest();

  const [callData, setCallData] = useState({
    id: '',
    project_id: '',
    name: '',
    url: '',
    method: 'GET',
    headers: [],
    body: '',
  });

  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('body');

  useEffect(() => {
    if (selectedCall) {
      setCallData({
        ...selectedCall,
        body: JSON.stringify(selectedCall.body, null, 2), // Convert body to JSON string
      });
    }
  }, [selectedCall]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCallData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleHeaderChange = (index, field, value) => {
    const newHeaders = [...callData.headers];
    newHeaders[index][field] = value;
    setCallData((prevData) => ({
      ...prevData,
      headers: newHeaders,
    }));
  };

  const handleAddHeader = () => {
    setCallData((prevData) => ({
      ...prevData,
      headers: [...prevData.headers, { key: '', value: '' }],
    }));
  };

  const handleSave = () => {
    createOrUpdateCall({
      ...callData,
      body: JSON.parse(callData.body), // Convert body back to JSON object
    });
  };

  const handleExecute = async () => {
    const result = await executeCall(selectedCall);
    setResults(result);
  };

  console.log("CALL DATA", callData)

  return (
    <Container>
      <Form>
        <Form.Group as={Row} controlId="formName">
          <Form.Label column sm="2">Name</Form.Label>
          <Col sm="10">
            <Form.Control
              type="text"
              name="name"
              value={callData.name}
              onChange={handleChange}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formUrl">
          <Form.Label column sm="2">URL</Form.Label>
          <Col sm="10">
            <Form.Control
              type="text"
              name="url"
              value={callData.url}
              onChange={handleChange}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formMethod">
          <Form.Label column sm="2">Method</Form.Label>
          <Col sm="10">
            <Form.Control
              as="select"
              name="method"
              value={callData.method}
              onChange={handleChange}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </Form.Control>
          </Col>
        </Form.Group>

        <Tabs
          id="controlled-tab"
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-3"
        >
          <Tab eventKey="body" title="Body">
            {(callData.method === 'POST' || callData.method === 'PUT') && (
              <Form.Group as={Row} controlId="formBody">
                <Form.Label column sm="2">Body</Form.Label>
                <Col sm="10">
                  <Form.Control
                    as="textarea"
                    rows={6}
                    name="body"
                    value={callData.body}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
            )}
          </Tab>
          <Tab eventKey="headers" title="Headers">
            <Table bordered>
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Value</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {callData.headers.map((header, index) => (
                  <tr key={index}>
                    <td>
                      <Form.Control
                        type="text"
                        value={header.key}
                        onChange={(e) => handleHeaderChange(index, 'key', e.target.value)}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        value={header.value}
                        onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
                      />
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => {
                          const newHeaders = callData.headers.filter((_, i) => i !== index);
                          setCallData((prevData) => ({
                            ...prevData,
                            headers: newHeaders,
                          }));
                        }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="3">
                    <Button variant="success" onClick={handleAddHeader}>
                      Add Header
                    </Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Tab>
        </Tabs>

        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
        {' '}
        <Button variant="secondary" onClick={handleExecute}>
          Execute
        </Button>
      </Form>

      {results && (
        <div className="border mt-3 p-3">
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </Container>
  );
};

export default EditCallForm;

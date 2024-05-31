import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import { useAPITest } from '../../packages/apitest/provider';

const CallsList = () => {
  const {
    calls,
    selectedCall,
    setSelectedCall,
    activeProjectId,
    createOrUpdateCall
  } = useAPITest();

  const handleSelectCall = (call) => {
    setSelectedCall(call);
  };

  const handleCreateNewCall = async () => {
    const newCall = {
      name: 'New',
      project_id: activeProjectId,
      url: '',
      headers: {},
      body: {}
    };
    const createdCall = await createOrUpdateCall(newCall);
    setSelectedCall(createdCall);
  };

  return (
    <div>
      <Button variant="primary" onClick={handleCreateNewCall}>Create New Call</Button>
      <h3>Calls</h3>
      {calls.length === 0 ? (
        <p>No calls found</p>
      ) : (
        <ListGroup>
          {calls.map((call, index) => (
            <ListGroup.Item
              key={index}
              active={selectedCall?.id === call.id}
              onClick={() => handleSelectCall(call)}
            >
              {call.name}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default CallsList;

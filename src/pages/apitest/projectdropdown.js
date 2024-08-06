import React, { useState, useEffect } from 'react';
import { InputGroup, FormControl, Dropdown, DropdownButton } from 'react-bootstrap';
import { useAPITest } from '../../packages/apitest/provider';

const ProjectDropdown = () => {
  const { projects, activeProject, setActiveProject } = useAPITest();

  const handleSelect = (eventKey) => {
    const selectedProject = projects.find(project => Number(project.id) === Number(eventKey));

    setActiveProject(selectedProject);
  };

  return (
    <InputGroup className="mb-3">
      <FormControl
        placeholder="Selected Project"
        value={activeProject ? activeProject.name : 'No project selected'}
        readOnly
      />
      <DropdownButton
        as={InputGroup.Append}
        variant="outline-secondary"
        title="Select Project"
        id="input-group-dropdown-1"
        onSelect={handleSelect}
      >
        {projects.map((project) => (
          <Dropdown.Item key={project.id} eventKey={project.id}>
            {project.name}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    </InputGroup>
  );
};

export default ProjectDropdown;

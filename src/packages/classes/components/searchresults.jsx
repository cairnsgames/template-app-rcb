import React from "react";
import { Card } from "react-bootstrap";
import ClassCard from "./classcard";

const SearchResults = ({ filteredClasses, handleClassClick }) => {
  console.log("Filtered Classes:", filteredClasses);
  return (
    <div className="p-4">
      <Card className="shadow">
        {filteredClasses.map((cls) => (
          <ClassCard 
            key={cls.id} 
            cls={cls} 
            onClick={() => handleClassClick(cls)} 
            variant="search" 
          />
        ))}
        {filteredClasses.length === 0 && (
          <Card.Body className="text-center text-muted">No classes match your search</Card.Body>
        )}
      </Card>
    </div>
  );
};

export default SearchResults;

import React, { useState, useEffect, Suspense } from "react";
import { Button, DropdownButton, Dropdown, Row, Col } from "react-bootstrap";
import { useNews } from "./newscontext";
import NewsThumb from "./newsthumb";
import { useUser } from "../auth/context/useuser";
import LoadingSpinner from "../../components/spinner/spinner";

const MyNewsEditor = React.lazy(() => import("./mynewseditor"));

const MyNews = () => {
  const { myNewsItems, fetchMyNewsItems, loading } = useNews();
  const { user } = useUser();
  const [showEditor, setShowEditor] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [sortOption, setSortOption] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc"); // Track sort order

  useEffect(() => {
    fetchMyNewsItems();
  }, [user]);

  const handleAdd = () => {
    setEditItemId(null);
    setShowEditor(true);
  };

  const handleEdit = (id) => {
    setEditItemId(id);
    setShowEditor(true);
  };

  const handleEditorClose = () => {
    setShowEditor(false);
    fetchMyNewsItems();
  };

  const handleSort = (option) => {
    if (sortOption === option) {
      // Toggle sort order if sorting by the same option
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortOption(option);
      setSortOrder("asc"); // Default to ascending order
    }
  };

  const sortedNewsItems = myNewsItems.sort((a, b) => {
    const compareValue = sortOrder === "asc" ? 1 : -1;

    if (sortOption === "title") {
      return a.title.localeCompare(b.title) * compareValue;
    } else if (sortOption === "expiry") {
      return (new Date(a.expires) - new Date(b.expires)) * compareValue;
    }
    return 0;
  });

  if (loading) {
    return <div><LoadingSpinner animation="border" /></div>;
  }

  return (
    <div className="my-news">
      {showEditor && (
        <Suspense fallback={<div>Loading...</div>}>
          <MyNewsEditor id={editItemId} onClose={handleEditorClose} />
        </Suspense>
      )}

      {!showEditor && (
        <>
          <Row className="mb-3">
            <Col>
              <Button variant="primary" onClick={handleAdd}>
                Add
              </Button>
            </Col>
            <Col>
              <DropdownButton
                id="sort-dropdown"
                title={`Sort`}
                onSelect={handleSort}
              >
                <Dropdown.Item eventKey="title">Title</Dropdown.Item>
                <Dropdown.Item eventKey="expiry">Expiry Date</Dropdown.Item>
              </DropdownButton>
            </Col>
          </Row>
          <Row>
            {sortedNewsItems.map((item) => (
              <NewsThumb
                key={item.id}
                item={item}
                onClick={() => handleEdit(item.id)}
                onEdit={() => handleEdit(item.id)}
              />
            ))}
          </Row>
        </>
      )}
    </div>
  );
};

export default MyNews;

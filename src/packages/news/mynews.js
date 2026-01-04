import React, { useState, useEffect, Suspense } from "react";
import {
  Button,
  DropdownButton,
  Dropdown,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import { useNews } from "./context/newscontext";
import NewsThumb from "./newsthumb";
import { useUser } from "../auth/context/useuser";
import LoadingSpinner from "../../components/spinner/spinner";
import Tracker from "../tracker/tracker";
import { useTranslation } from "react-i18next";

const MyNewsEditor = React.lazy(() => import("./mynewseditor"));

const MyNews = () => {
  const { t } = useTranslation();
  const { news, fetchMyNewsItems, loading, deleteNewsItem, setFilterField } =
    useNews();
  const { user } = useUser();
  const [showEditor, setShowEditor] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [sortOption, setSortOption] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showOldNews, setShowOldNews] = useState(false);

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
  };

  const handleSort = (option) => {
    if (sortOption === option) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortOption(option);
      setSortOrder("asc");
    }
  };

  const handleDelete = (id) => {
    deleteNewsItem(id);
    setEditItemId(undefined);
    setShowEditor(false);
  };

  const handleCheckboxChange = (e) => {
    setShowOldNews(e.target.checked);
    setFilterField("newItemsOnly", !e.target.checked);
  };

  const sortedNewsItems = news.sort((a, b) => {
    const compareValue = sortOrder === "asc" ? 1 : -1;

    if (sortOption === "title") {
      return a.title.localeCompare(b.title) * compareValue;
    } else if (sortOption === "expiry") {
      return (new Date(a.expires) - new Date(b.expires)) * compareValue;
    }
    return 0;
  });

  if (loading) {
    return (
      <div>
        <LoadingSpinner animation="border" />
      </div>
    );
  }

  return (
    <Tracker itemtype="partner.news" id={"news"}>
      <div className="my-news packagesMyNews">
        {showEditor && (
          <Suspense fallback={<div>{t("news.loading")}</div>}>
            <MyNewsEditor id={editItemId} onClose={handleEditorClose} />
          </Suspense>
        )}

        {!showEditor && (
          <>
            <Row className="mb-3">
              <Col xs={6} lg={3}>
                <Button variant="primary" onClick={handleAdd}>
                  {t("news.add")}
                </Button>
              </Col>
              <Col xs={6} lg={3}>
                <DropdownButton
                  id="sort-dropdown"
                  title={t("news.sort")}
                  onSelect={handleSort}
                >
                  <Dropdown.Item eventKey="title">
                    {t("news.title")}
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="expiry">
                    {t("news.expiryDate")}
                  </Dropdown.Item>
                </DropdownButton>
              </Col>
              <Col>
                <Form.Check
                  type="checkbox"
                  label={t("news.showOldNews")}
                  checked={showOldNews}
                  onChange={handleCheckboxChange}
                />
              </Col>
            </Row>
            <Row>
              {sortedNewsItems.map((item) => (
                <NewsThumb
                  key={item.id}
                  item={item}
                  onClick={() => handleEdit(item.id)}
                  onEdit={() => handleEdit(item.id)}
                  onDelete={() => handleDelete(item.id)}
                />
              ))}
            </Row>
          </>
        )}
      </div>
    </Tracker>
  );
};

export default MyNews;

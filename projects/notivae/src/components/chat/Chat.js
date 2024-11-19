import React, { useState, useRef, useEffect } from "react";
import { Button, Form, Container, InputGroup } from "react-bootstrap";
import "./Chat.css"; // Assuming a CSS file for additional styling
import { Chat as ChatIcon } from "react-bootstrap-icons";

const Chat = ({ floating = true }) => {
  const [messages, setMessages] = useState([
    {
      sender: "Alice",
      message: "Hi Bob",
      datetime: new Date(Date.now() - 24 * 60 * 60 * 1000),
    }, // Yesterday
    {
      sender: "Bob",
      message: "Hi Alice! ",
      datetime: new Date(Date.now() - 23 * 60 * 60 * 1000),
    }, // Yesterday
    {
      sender: "Alice",
      message: "how have you been?",
      datetime: new Date(Date.now() - 24 * 60 * 60 * 1000),
    }, // Yesterday
    {
      sender: "Bob",
      message: "I’ve been good, just super busy with work lately.",
      datetime: new Date(Date.now() - 23 * 60 * 60 * 1000),
    }, // Yesterday
    {
      sender: "Alice",
      message:
        "Yeah, same here. Things have been hectic. By the way, did you finish that project we discussed last month?",
      datetime: new Date(Date.now() - 22 * 60 * 60 * 1000),
    }, // Yesterday
    {
      sender: "Bob",
      message:
        "I did! It turned out pretty well, but it was a lot more challenging than I expected. The client was happy, though, so that’s all that matters!",
      datetime: new Date(Date.now() - 12 * 60 * 60 * 1000),
    }, // Half a day ago
    {
      sender: "Alice",
      message:
        "That’s great to hear! I’ve had a few tough projects myself recently. It’s rewarding when the client appreciates the effort.",
      datetime: new Date(Date.now() - 6 * 60 * 60 * 1000),
    }, // 6 hours ago
    {
      sender: "Bob",
      message:
        "Totally agree. Oh, by the way, have you been keeping up with the team updates? They’ve been rolling out new features almost every week now.",
      datetime: new Date(Date.now() - 4 * 60 * 60 * 1000),
    }, // 4 hours ago
    {
      sender: "Alice",
      message:
        "I have! Some of the new features are so cool. I especially liked the redesign of the dashboard—it’s much easier to use now.",
      datetime: new Date(Date.now() - 3 * 60 * 60 * 1000),
    }, // 3 hours ago
    {
      sender: "Bob",
      message:
        "Same here. I think they’ve really stepped up their game this year. Anyway, it was nice catching up. Let’s grab coffee soon?",
      datetime: new Date(Date.now() - 1 * 60 * 60 * 1000),
    }, // 1 hour ago
    {
      sender: "Alice",
      message:
        "Absolutely! Let’s plan for next weekend. I’ll message you with some options. Take care, Bob!",
      datetime: new Date(),
    }, // Just now
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const formatDateTime = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60)
      return `${diffInSeconds} sec${diffInSeconds !== 1 ? "s" : ""}`;
    if (diffInMinutes < 60)
      return `${diffInMinutes} min${diffInMinutes !== 1 ? "s" : ""}`;
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""}`;
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""}`;
  };

  const handleSend = () => {
    if (input.trim()) {
      setMessages([
        ...messages,
        { sender: "You", message: input, datetime: new Date() },
      ]);
      setInput("");
    }
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div
      className={`chat-container ${isOpen ? "open" : "closed"} ${
        floating ? "floating" : "non-floating"
      }`}
    >
      {isOpen && (
        <div
          className={`chat-window ${
            floating ? "floating-window" : "non-floating-window"
          }`}
        >
          <div className="chat-header">
            <h5>Chat</h5>
            <Button variant="close" onClick={closeChat} />
          </div>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${
                  msg.sender === "You" ? "sent" : "received"
                }`}
              >
                <div className="message-sender">
                  <div>
                    <strong>{msg.sender}:</strong>
                    <div className="datetime">
                      {formatDateTime(msg.datetime)}
                    </div>
                  </div>
                  <span className="message-text">{msg.message}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} /> {/* Empty div to scroll to */}
          </div>
          <div className="sticky-input-group">
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <InputGroup>
                <Form.Control
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                />
                <Button type="submit">Send</Button>
              </InputGroup>
            </Form>
          </div>
        </div>
      )}
      {!isOpen && (
        <Button onClick={() => setIsOpen(true)} className="chat-toggle">
          <ChatIcon />
        </Button>
      )}
    </div>
  );
};

export default Chat;

import React, { useState, useEffect } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { useTheme } from "../providers/theme/usetheme";
import { MoonStarsFill, SunFill } from "react-bootstrap-icons";

const DarkModeSwitch = () => {
  const { theme, setTheme } = useTheme();
  const [mode, setMode] = useState(theme === "dark");

  useEffect(() => {
    setTheme(mode ? "dark" : "light");
  }, [mode]);

  return (
    <InputGroup>
      <SunFill />
      <Form.Check
        className="mx-3"
        type="switch"
        checked={mode}
        onChange={() => setMode(!mode)}
      />
      <MoonStarsFill />
    </InputGroup>
  );
};

export default DarkModeSwitch;

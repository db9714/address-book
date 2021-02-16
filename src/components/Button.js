import React from "react";
import { Button } from "react-bootstrap";
import styles from "./css/Button.module.css";

const PlainButton = ({ className, title, ...rest }) => (
  <Button className={[styles.btnButton, className && className].join(" ")} {...rest}>
    {title}
  </Button>
);

export default PlainButton;

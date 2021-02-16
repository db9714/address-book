import React from "react";
import { Modal } from "react-bootstrap";
import { Dots } from "react-activity";

import "react-activity/dist/react-activity.css";
import styles from "./css/Loader.module.css";

const Loader = (props) => (
  <Modal id="activityModal" show={props.show} centered className={styles.modalContainer}>
    <Dots size={50} color="#324767" />
  </Modal>
);

export default Loader;

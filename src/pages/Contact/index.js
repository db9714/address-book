import React from "react";
import { Container, Row, Col, Popover, OverlayTrigger } from "react-bootstrap";

import Header from "./../../components/Header";
import styles from "./css/index.module.css";
import apiServices from "../../utility/api.services";
// import moment from "moment";
import PlainButton from "./../../components/Button";
import Table from "./ContactTable";
// import _ from "lodash";
import Loader from "./../../components/Loader";

const TABLE_HEADER = [
  { index: 0, title: "Full Name", style: { width: "20%" } },
  { index: 1, title: "Email", style: { width: "20%" } },
  { index: 2, title: "Mobile No", style: { width: "16%" } },
  { index: 3, title: "Street", style: { width: "16%" } },
  { index: 4, title: "City", style: { width: "16%" } },
  { index: 5, title: "State", style: { width: "20%" } },
  { index: 6, title: "Zip Code", style: { width: "20%" } },
];

class Contact extends React.Component {
  state = {
    tableData: [],
    showLoder: false,
  };
  componentDidMount() {
    this.getContact();
  }

  toggleLoader = (showLoader) => this.setState({ showLoader });

  getContact = () => {
    const token = localStorage.getItem("token");
    console.log(token, "token");

    apiServices.get("address/", false, { Token: token }, this.toggleLoader, (responseData, errorData) => {
      if (errorData === null) {
        this.setState({ tableData: responseData.results });
      } else console.log(errorData);
    });
  };
  render() {
    const { tableData, showLoader } = this.state;

    return (
      <>
        {showLoader && <Loader show={showLoader} />}

        <Container className={styles.container} fluid>
          <Header />
          <Row className={styles.columnStyle} style={{ justifyContent: "center", display: "flex", margin: "50px 0px 25px 0px" }}>
            <PlainButton title="Refresh Contact List" onClick={() => this.getContact()} />
          </Row>
          <Row className={styles.columnStyle}>
            <Col>
              <Table data={tableData} tableHeader={TABLE_HEADER} history={this.props.history} />
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default Contact;

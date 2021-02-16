import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import Header from "./../../components/Header";
import styles from "./css/index.module.css";
import apiServices from "../../utility/api.services";
import TextInput from "./../../components/TextInput";
import PlainButton from "./../../components/Button";
import Loader from "./../../components/Loader";

class Dashboard extends React.Component {
  state = {
    fullName: "",
    email: "",
    zipCode: "",
    street: "",
    city: "",
    mobileNo: "",
    state: "",
    contactList: [],
    didContactCreated: false,
    showLoader: false,
    createdBy: "",
    emailRegex: /^([A-Za-z0-9+_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/,
  };
  componentDidMount() {}
  toggleLoader = (showLoader) => this.setState({ showLoader });

  addContact = () => {
    const { fullName, email, zipCode, street, city, mobileNo, state, emailRegex } = this.state;

    if (!email) return this.setState({ txtError: "Email is required" });

    if (email.length === 0) return this.setState({ txtError: "Email is required" });
    else if (emailRegex.test(email) === false) return this.setState({ txtError: "Enter valid Email" });

    const payload = {
      full_name: fullName,
      email: email,
      zip_code: zipCode,
      street: street,
      city: city,
      mobile_no: mobileNo,
      state: state,
      createdBy: JSON.parse(localStorage.getItem("user"))[0].id,
    };
    var headers = {};
    apiServices.post("address/create", payload, headers, this.toggleLoader, (responseData, errorData) => {
      if (errorData === null) {
        this.setState({
          fullName: "",
          email: "",
          zipCode: "",
          street: "",
          city: "",
          mobileNo: "",
          state: "",
          didContactCreated: true,
        });
        document.getElementById("container").scroll(0, 0);

        setTimeout(() => {
          this.setState({ didContactCreated: false });
        }, 5000);
      } else console.log(errorData);
    });
  };
  render() {
    const { fullName, email, zipCode, street, city, mobileNo, state, didContactCreated, showLoader } = this.state;

    return (
      <>
        {showLoader && <Loader show={showLoader} />}

        <Container className={styles.container} id="container" fluid>
          <Header />
          {didContactCreated && (
            <Row style={{ margin: 20 }}>
              <Col style={{ justifyContent: "center", display: "flex" }}>
                <div className={styles.sucessMsg}>New Contact is created successfully.</div>
              </Col>
            </Row>
          )}

          <Col md={7} className={styles.column}>
            <RowComponent title={"Full Name"} value={fullName} />
            <RowComponent title={"Email"} value={email} />
            <RowComponent title={"Mobile Number"} value={mobileNo} />
            <RowComponent title={"Street"} value={street} />
            <RowComponent title={"City"} value={city} />
            <RowComponent title={"State"} value={state} />
            <RowComponent title={"Zip Code"} value={zipCode} />
            <Row className={styles.buttonBlock}>
              <PlainButton title="Save" onClick={() => this.addContact()} />
              <PlainButton
                title="Cancel"
                onClick={() =>
                  this.setState({
                    fullName: "",
                    email: "",
                    zipCode: "",
                    street: "",
                    city: "",
                    mobileNo: "",
                    state: "",
                  })
                }
              />
            </Row>
          </Col>
        </Container>
      </>
    );
  }
}

const RowComponent = (props) => (
  <Row className={styles.componentOuter}>
    <Col md={4} className="d-flex justify-content-end">
      {props.title}
    </Col>
    <Col md={1}>:</Col>
    <Col md={5}>
      <TextInput value={props.value} onChange={(e) => this.setState({ [props.value]: e.target.value })} />
    </Col>
  </Row>
);

export default Dashboard;

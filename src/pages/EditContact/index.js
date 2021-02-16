import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import Header from "./../../components/Header";
import styles from "./css/index.module.css";
import apiServices from "../../utility/api.services";
import TextInput from "./../../components/TextInput";
import PlainButton from "./../../components/Button";
import Loader from "./../../components/Loader";

class EditContact extends React.Component {
  state = {
    fullName: "",
    email: "",
    zipCode: "",
    street: "",
    city: "",
    mobileNo: "",
    state: "",
    contactList: [],
    didContactUpdated: false,
    showLoader: false,
    updatedBy: "",
  };
  componentDidMount() {
    console.log(this.props.match.params.id);
    this.editContact();
  }
  toggleLoader = (showLoader) => this.setState({ showLoader });

  editContact = () => {
    const token = localStorage.getItem("token");

    apiServices.get("address/" + this.props.match.params.id, false, { Token: token }, this.toggleLoader, (responseData, errorData) => {
      if (errorData === null) {
        this.setState({
          fullName: responseData.full_name,
          email: responseData.email,
          zipCode: responseData.zip_code,
          street: responseData.street,
          city: responseData.city,
          mobileNo: responseData.mobile_no,
          state: responseData.state,
        });
      } else console.log(errorData);
    });
  };

  updateContact = () => {
    const { fullName, email, zipCode, street, city, mobileNo, state } = this.state;

    const token = localStorage.getItem("token");
    let payload = {
      full_name: fullName,
      email: email,
      zip_code: zipCode,
      street: street,
      city: city,
      mobile_no: mobileNo,
      state: state,
    };
    var headers = {
      Authorization: `Bearer ${token}`,
    };
    apiServices.post("address/edit/" + this.props.match.params.id, payload, headers, this.toggleLoader, (responseData, errorData) => {
      if (errorData === null) {
        this.setState({ didContactUpdated: true });
        document.getElementById("container").scroll(0, 0);

        setTimeout(() => {
          this.setState({ didContactUpdated: false });
        }, 5000);
      } else console.log(errorData);
    });
  };
  render() {
    const { fullName, email, zipCode, street, city, mobileNo, state, didContactUpdated, showLoader } = this.state;

    return (
      <>
        {showLoader && <Loader show={showLoader} />}

        <Container className={styles.container} id="container" fluid>
          <Header />
          {didContactUpdated && (
            <Row style={{ margin: 20 }}>
              <Col style={{ justifyContent: "center", display: "flex" }}>
                <div className={styles.sucessMsg}>Contact is updated successfully.</div>
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
              <PlainButton title="Save" onClick={() => this.updateContact()} />
              <PlainButton title="Cancel" onClick={() => this.props.history.push("/contacts")} />
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
export default EditContact;

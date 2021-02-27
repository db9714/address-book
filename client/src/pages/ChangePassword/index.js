import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import Header from "./../../components/Header";
import styles from "./css/index.module.css";
import apiServices from "../../utility/api.services";
import TextInput from "./../../components/TextInput";
import PlainButton from "./../../components/Button";
import Loader from "./../../components/Loader";
import LOGO from "../../assets/images/address.jpg";

class ChangePassword extends React.Component {
  state = {
    newPassword: "",
    password: "",
    showLoader: false,
    txtError: "",
    token: "",
  };
  componentDidMount() {}
  toggleLoader = (showLoader) => this.setState({ showLoader });

  changePassWord = () => {
    const { newPassword, password } = this.state;

    if (password !== newPassword) {
      return this.setState({ txtError: "Password is not matched" });
    }
    let data = {
      token: localStorage.getItem("token"),
      password,
    };
    var headers = {
      "Content-Type": "text/plain",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    apiServices.post("auth/change-password/", data, headers, this.toggleLoader, (responseData, errorData) => {
      if (errorData === null) {
        console.log(responseData, "rees");
        this.props.history.push({
          pathname: "/dashboard",
        });
      } else {
        console.log(errorData);
        for (let error in errorData) {
          this.setState({ txtError: errorData[error] });
        }
      }
    });
  };
  render() {
    const { showLoader, newPassword, password, txtError } = this.state;

    return (
      <>
        {showLoader && <Loader show={showLoader} />}

        <Container className={styles.container} id="container" fluid>
          <Row className={["align-content-center justify-content-center row", styles.loginBox].join(" ")}>
            <Col md={4} className={["d-flex", "jumbotron flex-column mb-0"]}>
              <img src={LOGO} alt="logo" className={styles.logoStyle} />
              <span className={styles.titleText}> Address Book</span>
              <TextInput
                value={password}
                onChange={(e) => this.setState({ password: e.target.value })}
                placeholder="Old Password"
                type="password"
                className={styles.inputStyle}
              />
              <TextInput
                value={newPassword}
                onChange={(e) => this.setState({ newPassword: e.target.value })}
                placeholder="New Password"
                type="password"
                className={styles.inputStyle}
              />

              {txtError && <span className={styles.errorStyle}>{txtError}</span>}
              <PlainButton title="Change Password" onClick={() => this.changePassWord()} />
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default ChangePassword;

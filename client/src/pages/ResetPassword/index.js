import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import Header from "./../../components/Header";
import styles from "./css/index.module.css";
import apiServices from "../../utility/api.services";
import TextInput from "./../../components/TextInput";
import PlainButton from "./../../components/Button";
import Loader from "./../../components/Loader";
import LOGO from "../../assets/images/address.jpg";

class ResetPassword extends React.Component {
  state = {
    newPassword: "",
    password: "",
    showLoader: false,
    txtError: "",
    token: "",
  };
  componentDidMount() {
    let pathname = window.location.pathname;
    var pathArray = pathname.split("/");
    var token = pathArray[pathArray.length - 1];
    console.log(token);
    this.setState({ token });
  }
  toggleLoader = (showLoader) => this.setState({ showLoader });

  resetPassword = () => {
    const { token, password, newPassword } = this.state;

    if (password !== newPassword) return this.setState({ txtError: "Password is not matched" });

    let data = { token, password };

    apiServices.post("auth/new-password/", data, {}, this.toggleLoader, (responseData, errorData) => {
      if (errorData === null)
        this.props.history.push({
          pathname: "/",
        });
      else {
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
            <Col md={4} className={["d-flex", "flex-column mb-0", styles.box].join(" ")}>
              <img src={LOGO} alt="logo" className={styles.logoStyle} />
              <span className={styles.titleText}> Address Book</span>
              <TextInput
                value={password}
                onChange={(e) => this.setState({ password: e.target.value })}
                placeholder="New Password"
                type="password"
                className={styles.inputStyle}
              />
              <TextInput
                value={newPassword}
                onChange={(e) => this.setState({ newPassword: e.target.value })}
                placeholder="Re-enter New Password"
                type="password"
                className={styles.inputStyle}
              />

              {txtError && <span className={styles.errorStyle}>{txtError}</span>}
              <PlainButton title="Reset Password" onClick={() => this.resetPassword()} />
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default ResetPassword;

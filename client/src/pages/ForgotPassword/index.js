import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import styles from "./css/index.module.css";
import apiServices from "../../utility/api.services";
import TextInput from "./../../components/TextInput";
import PlainButton from "./../../components/Button";
import Loader from "./../../components/Loader";
import LOGO from "../../assets/images/address.jpg";

class ForgotPassword extends React.Component {
  state = {
    email: "",
    showLoader: false,
    txtError: "",
    txtSuccess: "",
    emailRegex: /^([A-Za-z0-9+_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/,
  };
  componentDidMount() {}
  toggleLoader = (showLoader) => this.setState({ showLoader });

  forgetPassword = () => {
    const { email, emailRegex } = this.state;

    if (!email) return this.setState({ txtError: "Email is required" });

    if (email.length === 0) return this.setState({ txtError: "Email is required" });
    else if (emailRegex.test(email) === false) return this.setState({ txtError: "Enter valid Email" });
    let data = { email };

    apiServices.post("auth/reset-password/", data, false, this.toggleLoader, (responseData, errorData) => {
      if (errorData === null) this.setState({ txtSuccess: responseData });
      else {
        console.log(errorData);
        for (let error in errorData) {
          this.setState({ txtError: errorData[error] });
        }
      }
    });
  };
  render() {
    const { showLoader, email, txtError, txtSuccess } = this.state;

    return (
      <>
        {showLoader && <Loader show={showLoader} />}

        <Container className={styles.container} id="container" fluid>
          <Row className={["align-content-center justify-content-center row", styles.loginBox].join(" ")}>
            <Col md={4} className={["d-flex", "flex-column mb-0", styles.box].join(" ")}>
              <img src={LOGO} alt="logo" className={styles.logoStyle} />
              <span className={styles.titleText}> Address Book</span>
              <span className={styles.subTitleText}> Forget Password</span>

              <TextInput value={email} onChange={(e) => this.setState({ email: e.target.value })} placeholder="Email" className={styles.inputStyle} />

              {txtError && <span className={styles.errorStyle}>{txtError}</span>}
              {txtSuccess && <span className={styles.successStyle}>{txtSuccess}</span>}

              <PlainButton title="Reset Password" onClick={() => this.forgetPassword()} />
              <PlainButton title="Back to login" style={{ marginTop: 10 }} onClick={() => this.props.history.push("/")} />
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default ForgotPassword;

import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import Header from "./../../components/Header";
import styles from "./css/index.module.css";
import apiServices from "../../utility/api.services";
import TextInput from "./../../components/TextInput";
import PlainButton from "./../../components/Button";
import Loader from "./../../components/Loader";
import LOGO from "../../assets/images/address.jpg";

class SignUp extends React.Component {
  state = {
    email: "",
    password: "",
    showLoader: false,
    txtError: "",
    name: "",
    emailRegex: /^([A-Za-z0-9+_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/,
  };
  componentDidMount() {
    localStorage.setItem("token", "");
  }
  toggleLoader = (showLoader) => this.setState({ showLoader });

  signUp = () => {
    const { name, email, password, emailRegex } = this.state;

    let data = { name, email, password };

    if (!email) return this.setState({ txtError: "Email is required" });

    if (email.length === 0) return this.setState({ txtError: "Email is required" });
    else if (emailRegex.test(email) === false) return this.setState({ txtError: "Enter valid Email" });

    apiServices.post("auth/signup/", data, {}, this.toggleLoader, (responseData, errorData) => {
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
    const { showLoader, email, password, txtError, name } = this.state;

    return (
      <>
        {showLoader && <Loader show={showLoader} />}

        <Container className={styles.container} id="container" fluid>
          <Row className={["align-content-center justify-content-center row", styles.loginBox].join(" ")}>
            <Col md={4} className={["d-flex", "flex-column mb-0", styles.box].join(" ")}>
              <img src={LOGO} alt="logo" className={styles.logoStyle} />
              <span className={styles.titleText}> Address Book</span>
              <TextInput value={name} onChange={(e) => this.setState({ name: e.target.value })} placeholder="Name" className={styles.inputStyle} />
              <TextInput
                value={email}
                onChange={(e) => this.setState({ email: e.target.value })}
                placeholder="Username"
                className={styles.inputStyle}
              />
              <TextInput
                value={password}
                onChange={(e) => this.setState({ password: e.target.value })}
                placeholder="password"
                type="password"
                className={styles.inputStyle}
              />
              {txtError && <span className={styles.errorStyle}>{txtError}</span>}
              <PlainButton title="Create Account" onClick={() => this.signUp()} />
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default SignUp;

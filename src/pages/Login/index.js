import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import Header from "./../../components/Header";
import styles from "./css/index.module.css";
import apiServices from "../../utility/api.services";
import TextInput from "./../../components/TextInput";
import PlainButton from "./../../components/Button";
import Loader from "./../../components/Loader";
import LOGO from "../../assets/images/address.jpg";

class Login extends React.Component {
  state = {
    email: "",
    password: "",
    showLoader: false,
    txtError: "",
  };
  componentDidMount() {
    localStorage.setItem("token", "");
  }
  toggleLoader = (showLoader) => this.setState({ showLoader });

  login = () => {
    const { email, password } = this.state;
    let data = {
      email,
      password,
    };

    apiServices.post("auth/signin/", data, {}, this.toggleLoader, (responseData, errorData) => {
      if (errorData === null) {
        localStorage.setItem("token", responseData.token);
        localStorage.setItem("user", JSON.stringify([responseData.user]));

        this.props.history.push({
          pathname: "/contacts",
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
    const { showLoader, email, password, txtError } = this.state;

    return (
      <>
        {showLoader && <Loader show={showLoader} />}

        <Container className={styles.container} id="container" fluid>
          <Row className={["align-content-center justify-content-center row", styles.loginBox].join(" ")}>
            <Col md={4} className={["d-flex", "flex-column mb-0", styles.box].join(" ")}>
              <img src={LOGO} alt="logo" className={styles.logoStyle} />
              <span className={styles.titleText}> Address Book</span>
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
              <PlainButton title="Sign In" onClick={() => this.login()} />
              <span className="text-right" style={{ cursor: "pointer", fontSize: 13 }} onClick={() => this.props.history.push("/forgotpassword")}>
                Forgot password
              </span>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default Login;

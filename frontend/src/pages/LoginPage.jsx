import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, InputGroup, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaSignInAlt,
  FaExclamationCircle,
} from "react-icons/fa";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import Meta from "../components/Meta";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const redirect = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !validateEmail(value)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address",
      }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (value && value.length < 6) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters",
      }));
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const res = await login({ email, password, remember }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("Login successful");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <FormContainer>
      <Meta title={"Sign In"} />
      <Card className="p-4 shadow-sm border-0">
        <div className="text-center mb-4">
          <h1 className="h3 mb-3 fw-normal">Welcome Back!</h1>
          <p className="text-muted">Please sign in to your account</p>
        </div>
        <Form onSubmit={submitHandler} noValidate>
          <Form.Group className="mb-4" controlId="email">
            <Form.Label>
              <FaEnvelope className="me-2" />
              Email address
            </Form.Label>
            <Form.Control
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={handleEmailChange}
              className={`py-2 ${errors.email ? "is-invalid" : ""}`}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              <FaExclamationCircle className="me-1" />
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-4" controlId="password">
            <Form.Label>
              <FaLock className="me-2" />
              Password
            </Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Enter your password"
                onChange={handlePasswordChange}
                className={`py-2 ${errors.password ? "is-invalid" : ""}`}
                isInvalid={!!errors.password}
              />
              <InputGroup.Text
                onClick={togglePasswordVisibility}
                id="togglePasswordVisibility"
                style={{ cursor: "pointer" }}
                className="bg-light"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </InputGroup.Text>
              <Form.Control.Feedback type="invalid">
                <FaExclamationCircle className="me-1" />
                {errors.password}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Row className="mb-4">
            <Col>
              <Form.Group controlId="checkbox">
                <Form.Check
                  type="checkbox"
                  label="Keep me signed in"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                  className="text-muted"
                />
              </Form.Group>
            </Col>
            <Col className="text-end">
              <Link to="/reset-password" className="text-decoration-none">
                Forgot password?
              </Link>
            </Col>
          </Row>
          <Button
            className="w-100 py-2 mb-4"
            variant="warning"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader />
            ) : (
              <>
                <FaSignInAlt className="me-2" />
                Sign In
              </>
            )}
          </Button>
        </Form>
        <div className="text-center">
          <p className="mb-0">
            New Customer?{" "}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              className="text-decoration-none fw-bold"
            >
              Create an account
            </Link>
          </p>
        </div>
      </Card>
    </FormContainer>
  );
};

export default LoginPage;

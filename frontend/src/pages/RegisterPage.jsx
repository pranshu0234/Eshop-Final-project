import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Form, Button, Row, Col, InputGroup, Card } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserPlus,
  FaExclamationCircle,
} from "react-icons/fa";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import Meta from "../components/Meta";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

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

  const toggleConfirmPasswordVisibility = () => {
    setConfirmShowPassword(!showConfirmPassword);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateName = (name) => {
    return name.length >= 2;
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!name) {
      newErrors.name = "Name is required";
    } else if (!validateName(name)) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(password)) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    if (value && !validateName(value)) {
      setErrors((prev) => ({
        ...prev,
        name: "Name must be at least 2 characters",
      }));
    } else {
      setErrors((prev) => ({ ...prev, name: "" }));
    }
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
    if (value && !validatePassword(value)) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters",
      }));
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
    // Update confirm password error if it exists
    if (confirmPassword && value !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (value && value !== password) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const res = await register({ name, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("Registration successful. Welcome!");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <FormContainer>
      <Meta title={"Register"} />
      <Card className="p-4 shadow-sm border-0">
        <div className="text-center mb-4">
          <h1 className="h3 mb-3 fw-normal">Create Account</h1>
          <p className="text-muted">Join us and start shopping!</p>
        </div>
        <Form onSubmit={submitHandler} noValidate>
          <Form.Group className="mb-4" controlId="name">
            <Form.Label>
              <FaUser className="me-2" />
              Full Name
            </Form.Label>
            <Form.Control
              value={name}
              type="text"
              placeholder="Enter your full name"
              onChange={handleNameChange}
              className={`py-2 ${errors.name ? "is-invalid" : ""}`}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">
              <FaExclamationCircle className="me-1" />
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-4" controlId="email">
            <Form.Label>
              <FaEnvelope className="me-2" />
              Email address
            </Form.Label>
            <Form.Control
              value={email}
              type="email"
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
                placeholder="Create a password"
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
          <Form.Group className="mb-4" controlId="confirmPassword">
            <Form.Label>
              <FaLock className="me-2" />
              Confirm Password
            </Form.Label>
            <InputGroup>
              <Form.Control
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                placeholder="Confirm your password"
                onChange={handleConfirmPasswordChange}
                className={`py-2 ${errors.confirmPassword ? "is-invalid" : ""}`}
                isInvalid={!!errors.confirmPassword}
              />
              <InputGroup.Text
                onClick={toggleConfirmPasswordVisibility}
                id="toggleConfirmPasswordVisibility"
                style={{ cursor: "pointer" }}
                className="bg-light"
              >
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </InputGroup.Text>
              <Form.Control.Feedback type="invalid">
                <FaExclamationCircle className="me-1" />
                {errors.confirmPassword}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
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
                <FaUserPlus className="me-2" />
                Create Account
              </>
            )}
          </Button>
        </Form>
        <div className="text-center">
          <p className="mb-0">
            Already have an account?{" "}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
              className="text-decoration-none fw-bold"
            >
              Sign In
            </Link>
          </p>
        </div>
      </Card>
    </FormContainer>
  );
};

export default RegisterPage;

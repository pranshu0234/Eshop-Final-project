import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  FaTrash,
  FaMinus,
  FaPlus,
  FaShoppingBag,
  FaArrowRight,
} from "react-icons/fa";
import {
  Row,
  Col,
  Card,
  ListGroup,
  Form,
  Image,
  Button,
  ListGroupItem,
  Badge,
  Alert,
} from "react-bootstrap";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import Message from "../components/Message";
import { addToCart, removeFromCart } from "../slices/cartSlice";
import Meta from "../components/Meta";
import { addCurrency } from "../utils/addCurrency";
import Loader from "../components/Loader";

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { data: products, isLoading: isLoadingProducts } = useGetProductsQuery({
    limit: 4,
  });

  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = async (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  const updateQuantity = (item, change) => {
    const newQty = item.qty + change;
    if (newQty > 0 && newQty <= item.countInStock) {
      addToCartHandler(item, newQty);
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );
  const shipping = subtotal > 1000 ? 0 : 100;
  const tax = subtotal * 0.18; // 18% tax
  const total = subtotal + shipping + tax;

  return (
    <>
      <Meta title={"Shopping Cart"} />
      <div className="py-4">
        <h1 className="mb-4">Shopping Cart</h1>
        <Row>
          <Col md={8}>
            {cartItems.length === 0 ? (
              <Card className="p-4 text-center">
                <FaShoppingBag size={50} className="text-muted mb-3" />
                <h3>Your cart is empty</h3>
                <p className="text-muted mb-4">
                  Looks like you haven't added anything to your cart yet.
                </p>
                <Link to="/">
                  <Button variant="warning" className="px-4">
                    Continue Shopping
                  </Button>
                </Link>
              </Card>
            ) : (
              <ListGroup variant="flush" className="cart-items">
                {cartItems.map((item) => (
                  <ListGroup.Item
                    key={item._id}
                    className="mb-3 border rounded shadow-sm"
                  >
                    <Row className="align-items-center">
                      <Col md={2} className="text-center">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fluid
                          rounded
                          className="product-image"
                          style={{ maxHeight: "100px", objectFit: "contain" }}
                        />
                      </Col>
                      <Col md={4}>
                        <Link
                          to={`/product/${item._id}`}
                          className="product-title text-dark fw-bold"
                          style={{ textDecoration: "none" }}
                        >
                          {item.name}
                        </Link>
                        <div className="text-muted small mt-1">
                          {item.countInStock > 0 ? (
                            <Badge bg="success">In Stock</Badge>
                          ) : (
                            <Badge bg="danger">Out of Stock</Badge>
                          )}
                        </div>
                      </Col>
                      <Col md={2} className="text-center">
                        <div className="fw-bold">{addCurrency(item.price)}</div>
                        <div className="text-muted small">per item</div>
                      </Col>
                      <Col md={2}>
                        <div className="d-flex align-items-center justify-content-center">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="quantity-btn"
                            onClick={() => updateQuantity(item, -1)}
                            disabled={item.qty <= 1}
                          >
                            <FaMinus />
                          </Button>
                          <span className="mx-2">{item.qty}</span>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="quantity-btn"
                            onClick={() => updateQuantity(item, 1)}
                            disabled={item.qty >= item.countInStock}
                          >
                            <FaPlus />
                          </Button>
                        </div>
                      </Col>
                      <Col md={2} className="text-end">
                        <div className="fw-bold mb-1">
                          {addCurrency(item.qty * item.price)}
                        </div>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeFromCartHandler(item._id)}
                          className="mt-2"
                        >
                          <FaTrash /> Remove
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Col>
          <Col md={4}>
            <Card className="shadow-sm">
              <Card.Header className="bg-light">
                <h4 className="mb-0">Order Summary</h4>
              </Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>
                      Subtotal (
                      {cartItems.reduce((acc, item) => acc + item.qty, 0)}{" "}
                      items)
                    </Col>
                    <Col className="text-end">{addCurrency(subtotal)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col className="text-end">
                      {shipping === 0 ? (
                        <span className="text-success">Free</span>
                      ) : (
                        addCurrency(shipping)
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax (18%)</Col>
                    <Col className="text-end">{addCurrency(tax)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item className="bg-light">
                  <Row>
                    <Col>
                      <strong>Total</strong>
                    </Col>
                    <Col className="text-end">
                      <strong>{addCurrency(total)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroupItem>
                  <Button
                    className="w-100"
                    variant="warning"
                    type="button"
                    disabled={cartItems.length === 0}
                    onClick={checkoutHandler}
                  >
                    Proceed to Checkout <FaArrowRight className="ms-2" />
                  </Button>
                </ListGroupItem>
              </ListGroup>
            </Card>

            {shipping > 0 && (
              <Alert variant="info" className="mt-3">
                Add items worth {addCurrency(1000 - subtotal)} more to get free
                shipping!
              </Alert>
            )}
          </Col>
        </Row>

        {cartItems.length > 0 && !isLoadingProducts && products && (
          <div className="mt-5">
            <h3 className="mb-4">You May Also Like</h3>
            <Row>
              {products.products
                .filter(
                  (product) =>
                    !cartItems.find((item) => item._id === product._id)
                )
                .slice(0, 4)
                .map((product) => (
                  <Col key={product._id} sm={6} md={3} className="mb-4">
                    <Card className="h-100 shadow-sm">
                      <Link to={`/product/${product._id}`}>
                        <Card.Img
                          src={product.image}
                          variant="top"
                          style={{ height: "200px", objectFit: "contain" }}
                        />
                      </Link>
                      <Card.Body>
                        <Link
                          to={`/product/${product._id}`}
                          className="text-dark text-decoration-none"
                        >
                          <Card.Title as="h6" className="mb-2">
                            {product.name}
                          </Card.Title>
                        </Link>
                        <Card.Text className="fw-bold">
                          {addCurrency(product.price)}
                        </Card.Text>
                        <Button
                          variant="outline-warning"
                          size="sm"
                          className="w-100"
                          onClick={() => addToCartHandler(product, 1)}
                          disabled={product.countInStock === 0}
                        >
                          Add to Cart
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
            </Row>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;

import { useState, useContext } from 'react';
import { Navbar, Nav, Button, Modal, Form, Dropdown, DropdownButton } from 'react-bootstrap';
import { Link, useParams, useHistory } from 'react-router-dom';
import { useQuery, useMutation } from "react-query";

import 'bootstrap/dist/css/bootstrap.min.css';

import { UserContext } from "../contexts/userContext";
import { CartContext } from "../contexts/cartContext";

// import UserData from '../components/userData';

import { API, setAuthToken } from "../config/api";

function NavbarComp() {
    let history = useHistory();

    const [state, dispatch] = useContext(UserContext);
    const [stateCart, dispatchCart] = useContext(CartContext);

    const [Message, setMessage] = useState({});
    const [userRegis, setUserRegis] = useState({});

    // MODAL ======================================================
    const [showL, setShowL] = useState(false);
    const [showR, setShowR] = useState(false);
    const handleCloseL = () => setShowL(false);
    const handleCloseR = () => setShowR(false);

    const handleShowL = () => {
        // e.preventDefault();
        setShowL(true);
        setShowR(false);
    }

    const handleShowR = () => {
        // e.preventDefault();
        setShowL(false);
        setShowR(true);
    };
    // Akhir MODAL ======================================================

    // AUTH ======================================================
    // Login
    const [form, setForm] = useState({});

    const { emailLoginData, passwordLoginData } = form;

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };

            const body = JSON.stringify({
                email: emailLoginData,
                password: passwordLoginData,
            });

            const response = await API.post("/login", body, config);
            dispatch({
                type: "LOGIN_SUCCESS",
                payload: response.data.data.user,
            });

            setAuthToken(response.data.data.user.token);
            history.push("/");

            // console.log("RESPONSE LOGIN", response.data);
            setMessage(null);
            setForm({
                emailLoginData: '',
                passwordLoginData: ''
            });
        } catch (error) {
            if (error) {
                setMessage({
                    status: 'failed',
                    message: 'Login Failed'
                });
            }
            console.log(error);
        }
    }

    const Logout = (e) => {
        e.preventDefault();
        dispatch({
            type: "LOGOUT",
        });
        history.push('/')
    }

    // Register
    const [formResgiter, setFormResgiter] = useState({
        email: '',
        fullname: '',
        password: '',
        gender: '',
        phone: '',
        role: ''
    })

    const { email,
        fullname,
        password,
        gender,
        phone,
        role } = formResgiter;

    const onChangeRegister = (e) => {
        const tempForm = { ...formResgiter };
        tempForm[e.target.name] = e.target.value;
        setFormResgiter(tempForm);
    };

    const handleRegister = useMutation(async () => {

        const body = new FormData();

        body.append("email", email);
        body.append("fullname", fullname);
        body.append("password", password);
        body.append("gender", gender);
        body.append("phone", phone);
        body.append("role", role);


        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        await API.post("/register", body, config);
        handleShowL();
        setFormResgiter({
            email: '',
            fullname: '',
            password: '',
            gender: '',
            phone: '',
            role: ''
        });
        setMessage({
            status: 'success',
            message: ''
        });
    });

    // Akhir AUTH ======================================================

    const CartClick = (e) => {
        if (stateCart.carts.length == 0) {
            e.preventDefault();
        }
    }

    let avatar = '../assets/user.png';

    if (state.isLogin && state.user.role == "PARTNER") {
        avatar = './assets/partner.png';
    }

    if (state.isLogin && state.user.image) {
        avatar = state.user.image;
    }

    var JmlOrder = 0;

    for (var i = 0; i < stateCart.carts.length; i++) {
        JmlOrder = JmlOrder + stateCart.carts[i].qty;
    }

    // console.log("REGISSS", handleRegister.isSuccess);
    let btnRegister = false;
    if (email &&
        fullname &&
        password &&
        gender &&
        phone &&
        role) {
        btnRegister = true;
    }

    if (state.isLogin) {
        return (
            <div>
                <Navbar expand="lg" className="fixed-top bg-yellow">
                    <Navbar.Brand>
                        <Link className="text-warning ml-2" to={{ pathname: "/", }}>
                            <img src='../assets/icon.png' />
                        </Link>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                            {state.user.role == 'USER' ? (
                                <Link className="text-rest" onClick={CartClick} to={{ pathname: "/cart-order/" }}>
                                    <img src="../assets/chart.png" className="img-chart" />
                                    {stateCart.carts.length != 0 &&
                                        <span className="inc-chart d-inline">{JmlOrder}</span>
                                    }
                                </Link>
                            ) : ''}
                            <Dropdown >
                                <Dropdown.Toggle variant="transparen" className="btn-dropdown-after-login" id="dropdown-basic">
                                    <img src={avatar} className="img-user" />
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="dropdown-menu-right shadow">
                                    {state.user.role == 'USER' && (
                                        <>
                                            <Link className="text-dropdown pl-2 py-2 d-block" to={{ pathname: "/profile", }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-person mb-1 mr-2" viewBox="0 0 16 16">
                                                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                                                </svg>
                                                Profile
                                            </Link>
                                        </>
                                    )}
                                    {state.user.role == 'PARTNER' && (
                                        <>
                                            <Link className="text-dropdown pl-2 py-2 d-block" to={{ pathname: "/profile-partner", }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-person mb-1 mr-2" viewBox="0 0 16 16">
                                                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                                                </svg>
                                                Profile Partner
                                            </Link>
                                            <Link className="text-dropdown pl-2 py-2 d-block" to={{ pathname: "/add-product", }}>
                                                <img src="../assets/food.png" className="img-dropdown-food mb-1 mr-1" />
                                                Add Product
                                            </Link>
                                        </>
                                    )}
                                    <hr className="my-1" />
                                    <Link onClick={Logout} className="text-dropdown-logout pl-2 py-2 d-block" to={{ pathname: "/", }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-box-arrow-right mr-2 text-danger" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" />
                                            <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
                                        </svg>
                                        Logout
                                    </Link>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div >
        );
    } else {
        return (
            <div>
                <Navbar expand="lg" className="fixed-top bg-yellow">
                    <Navbar.Brand >
                        <Link className="text-warning ml-2" to={{ pathname: "/", }}>
                            <img src='../assets/icon.png' />
                        </Link>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                            <Button className="btn btn-sm btn-auth btn-warning text-light" onClick={handleShowR}>Register</Button>
                            <Button className="btn btn-sm btn-auth btn-warning text-light" onClick={handleShowL}> Login</Button>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>

                <Modal show={showL} onHide={handleCloseL} centered>
                    <Modal.Body className="mx-3">
                        <div className="register-header mb-3">Login</div>
                        {Message?.status == 'failed' &&
                            <div className="alert alert-danger py-1 px-2">{Message.message}</div>
                        }
                        {Message?.status == 'success' && (
                            <div className="mb-3 alert alert-success px-2 py-2">
                                <b className="py-1 px-0">Account successfully created</b> <br />
                                <small className="py-1 px-0">Thank you for your registration! Your account is now ready to use.</small>
                            </div>
                        )}
                        <Form className="register" onSubmit={(e) => handleLogin(e)}>
                            <Form.Group controlId="exampleForm.ControlInput1L">
                                <Form.Control value={emailLoginData}
                                    onChange={(e) => onChange(e)} type="email" name="emailLoginData" placeholder="Email" />
                            </Form.Group>
                            <Form.Group controlId="exampleForm.ControlInput2L">
                                <Form.Control value={passwordLoginData}
                                    onChange={(e) => onChange(e)} type="password" name="passwordLoginData" placeholder="Password" />
                            </Form.Group>
                            <Button type="submit" className="btn btn-modal btn-warning text-light btn-block mt-4">Login</Button>
                        </Form>
                        <p className="text-muted text-center mt-3">Don't have an account ? Klik <a href="#" onClick={handleShowR} className="text-dark">Here</a></p>
                    </Modal.Body>
                </Modal>

                <Modal className="modal-auth" centered show={showR} onHide={handleCloseR} >
                    <Modal.Body className="mx-3">
                        <div className="register-header mb-4">Register</div>
                        {handleRegister?.error?.response?.data?.status == 'Register Failed' &&
                            <div className="alert alert-danger py-1 px-2">{handleRegister?.error?.response?.data?.message}</div>
                        }
                        <Form className="register" onSubmit={(e) => { e.preventDefault(); handleRegister.mutate() }}>
                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Control value={email} onChange={(e) => onChangeRegister(e)} type="text" name="email" placeholder="Email" />
                            </Form.Group>

                            <Form.Group controlId="exampleForm.ControlInput2">
                                <Form.Control value={password} onChange={(e) => onChangeRegister(e)} type="password" name="password" placeholder="Password" />
                            </Form.Group>

                            <Form.Group controlId="exampleForm.ControlInput3">
                                <Form.Control value={fullname} onChange={(e) => onChangeRegister(e)} type="text" name="fullname" placeholder="Full Name" />
                            </Form.Group>

                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Control as="select" name="gender" onChange={(e) => onChangeRegister(e)} required>
                                    <option selected>Choose gender</option>
                                    <option value="Male" >Male</option>
                                    <option value="Female">Female</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="exampleForm.ControlInput5">
                                <Form.Control value={phone} onChange={(e) => onChangeRegister(e)} type="text" name="phone" placeholder="Phone" />
                            </Form.Group>

                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Control as="select" name="role" onChange={(e) => onChangeRegister(e)} required>
                                    <option selected>Choose as</option>
                                    <option value="USER" >As User</option>
                                    <option value="PARTNER">As Partner</option>
                                </Form.Control>
                            </Form.Group>
                            {btnRegister ?
                                <Button type="submit" className="btn btn-warning text-light btn-modal btn-block mt-4">Register</Button>
                                :
                                <Button type="button" disabled={true} className="btn not-allowed text-light btn-secondary btn-block mt-4">Register</Button>
                            }
                        </Form>
                        <p className="text-muted text-center mt-3">Already have an account ?  Klik <a href="#" onClick={handleShowL} className="text-dark">Here</a></p>
                        {/* <pre>{JSON.stringify(formResgiter, null, 2)}</pre> */}
                    </Modal.Body>
                </Modal>
            </div >
        );
    }
}


export default NavbarComp;

import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Navbar, Nav, Button, Modal, Form } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { useContext, useState } from 'react';

import DataUser from '../components/userData';

import CardRestaurant from '../components/CardRestaurant';

import { UserContext } from "../contexts/userContext";
import { CartContext } from "../contexts/cartContext";

import { API } from "../config/api";
import { useQuery } from "react-query";

function RestNearYou() {
    let history = useHistory();
    const path = '../assets/rest-near-you/';
    const data = [
        {
            id: 'r1',
            nama: 'Geprek Bensu',
            jarak: '0,2 KM',
            logo: path + 'gb.png'
        },
        {
            id: 'r2',
            nama: 'Nasi Goreng Mas Rony',
            jarak: '0,6 KM',
            logo: path + 'ns.png'
        },
        {
            id: 'r3',
            nama: 'Pecel Ayam Prambanan',
            jarak: '0,6 KM',
            logo: path + 'pa.png'
        },
        {
            id: 'r4',
            nama: 'Kopi Kenangan',
            jarak: '1,6 KM',
            logo: path + 'kk.png'
        }
    ];

    const [state, dispatch] = useContext(UserContext);
    const [stateCartRNY, dispatchCartRNY] = useContext(CartContext);

    const [Message, setMessage] = useState('');
    const [showL, setShowL] = useState(false);
    const [showR, setShowR] = useState(false);
    const [userRegis, setUserRegis] = useState({});

    const handleCloseL = () => setShowL(false);
    const handleShowL = () => setShowL(true);
    const handleCloseR = () => setShowR(false);
    const handleShowR = () => setShowR(true);

    const SelectRest = (e) => {
        // console.log('SelectRest', e);
        if (!state.isLogin) {
            // e.stopPropagation();
            setShowL(true);
        } else {
            history.push('/menus/' + e.id)
            dispatchCartRNY({
                type: "ADD_RESTAURANT",
                payload: e
            });
        }
    }

    const handleLogin = (e) => {
        e.preventDefault();

        let emailLData = e.target.elements.emailLogin.value;
        let passwordLData = e.target.elements.passwordLogin.value;

        var dataLogin = false;

        dataLogin = DataUser.find(
            (user) => user.email === emailLData
        );

        if (dataLogin) {
            handleCloseL();
            dispatch({
                type: "LOGIN_SUCCESS",
                payload: dataLogin
            });
        } else {
            setMessage('Email tidak ditemukan')
        }

    }

    const handleShowL2 = (e) => {
        e.preventDefault();
        setShowL(true);
        setShowR(false);
    }

    const handleShowR2 = (e) => {
        e.preventDefault();
        setShowL(false);
        setShowR(true);
    };

    const handleRegis = (e) => {
        e.preventDefault()
        let emailData = e.target.elements.email.value;
        let passwordData = e.target.elements.password.value;
        let nameData = e.target.elements.name.value;
        let genderData = e.target.elements.gender.value;
        let phoneData = e.target.elements.phone.value;
        let asData = e.target.elements.as.value;

        var dataUserRegis = {
            email: emailData,
            password: passwordData,
            nama: nameData,
            gender: genderData,
            phone: phoneData,
            as: asData
        }
        setUserRegis(dataUserRegis)
    }


    const { data: PartnersData, loading, error, refetch } = useQuery(
        "userCache",
        async () => {
            const response = await API.get("partners");
            return response;
        }
    );

    return (
        <div>
            <Container>
                <Row>
                    <Col md={12}>
                        <div data-aos="fade-up" data-aos-delay="250" className="text-dark playfair header-content mt-5 mb-3">
                            Restaurant Near You
                            </div>
                    </Col>
                    {PartnersData?.data?.data?.map((item) => (
                        item.popular == 0 &&
                        <Col md={3} key={item.id}>
                            <CardRestaurant product={item} SelectRest={SelectRest} />
                        </Col>
                    ))}
                    {/* {data.map(item =>
                        <Col md={3} key={item.id}>
                            <CardRestaurant product={item} SelectRest={SelectRest} />
                        </Col>
                    )} */}
                    {/* <pre>{JSON.stringify(PartnersData?.data?.data[0].popular, null, 2)}</pre> */}
                </Row>
            </Container>
            <Modal show={showL} onHide={handleCloseL} centered>
                <Modal.Body className="mx-3">
                    <div className="register-header mb-4">Login</div>
                    {Message ?
                        <div className="alert alert-danger py-1 px-2">{Message}</div>
                        : ''
                    }
                    <Form className="register" onSubmit={handleLogin}>
                        <Form.Group controlId="exampleForm.ControlInput1L">
                            <Form.Control type="text" name="emailLogin" placeholder="Email" />
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlInput2L">
                            <Form.Control type="password" name="passwordLogin" placeholder="Password" />
                        </Form.Group>
                        <Button type="submit" className="btn btn-modal btn-block mt-4 btn-warning text-light">Login</Button>
                    </Form>
                    <p className="text-muted text-center mt-3">Don't have an account ? Klik <a href="#" onClick={handleShowR2} className="text-dark">Here</a></p>
                </Modal.Body>
            </Modal>
            <Modal show={showR} onHide={handleCloseR} centered>
                <Modal.Body className="mx-3">
                    <div className="register-header mb-4">Register</div>
                    <Form className="register" onSubmit={handleRegis}>
                        <Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Control type="text" name="email" placeholder="Email" />
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlInput2">
                            <Form.Control type="password" name="password" placeholder="Password" />
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlInput3">
                            <Form.Control type="text" name="name" placeholder="Full Name" />
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlInput4">
                            <Form.Control type="text" name="gender" placeholder="Gender" />
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlInput5">
                            <Form.Control type="text" name="phone" placeholder="Phone" />
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Control as="select" name="as">
                                <option value="user">As User</option>
                                <option value="partner">As Partner</option>
                            </Form.Control>
                        </Form.Group>
                        <Button type="submit" className="btn btn-modal btn-block mt-4 btn-warning text-light">Register</Button>
                    </Form>
                    <p className="text-muted text-center mt-3">Already have an account ?  Klik <a href="#" onClick={handleShowL2} className="text-dark">Here</a></p>
                    <pre>{JSON.stringify(userRegis, null, 2).length != 2 && JSON.stringify(userRegis, null, 2)}</pre>
                </Modal.Body>
            </Modal>
        </div >
    );
}

export default RestNearYou;

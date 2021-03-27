import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { Container, Row, Col, Modal } from 'react-bootstrap';
import React, { useContext, useState } from 'react';

import { CartContext } from "../contexts/cartContext";
import { UserContext } from "../contexts/userContext";

import { useHistory } from 'react-router-dom';

function Profile() {
    let history = useHistory();

    const [stateCartDetail, dispatchCartDetail] = useContext(CartContext);
    const [stateUserLogin, dispatchUserLogin] = useContext(UserContext);

    console.log('User:', stateUserLogin);

    const imgSquare = stateUserLogin.user.imgSquare;

    const EditProfile = () => {
        history.push('/edit-profile-partner');
    }

    return (
        <>
            <Container className="my-5 py-5">
                <Row>
                    <Col xs={6}>
                        <div className="playfair text-header-profile mb-4">
                            Profile Partner
                        </div>
                        <div className="box-img-text">
                            <img src={imgSquare} className="rounded" />
                            <span className="ml-3">
                                <div className="h5 text-rest mb-4">
                                    Full Name
                                    <div className="text-dark text-data-profile">
                                        {stateUserLogin.user.name}
                                    </div>
                                </div>
                                <div className="h5 text-rest mb-4">
                                    Email
                                    <div className="text-dark text-data-profile">
                                        {stateUserLogin.user.email}
                                    </div>
                                </div>
                                <div className="h5 text-rest mb-4">
                                    Phone
                                    <div className="text-dark text-data-profile">
                                        {stateUserLogin.user.phone}
                                    </div>
                                </div>
                            </span>
                        </div>
                        <button onClick={EditProfile} className="btn text-light btn-modal btn-sm btn-edi-profile mt-3">Edit Profile</button>
                    </Col>
                    <Col xs={6}>
                        <div className="playfair text-header-profile mb-4">
                            History Order
                        </div>
                        <div className="card mb-1">
                            <div className="card-body py-3">
                                <div className="box-2-column-text">
                                    <div className="">
                                        <div className="playfair mb-2"><b>Andi</b></div>
                                        <div>12 March 2021</div>
                                        <div className="text-rest mt-3"><b>Total : Rp 45.000</b></div>
                                    </div>
                                    <div className="ml-3 text-right d-block">
                                        <img src="../assets/icon.png" />
                                        <div className="mt-4">
                                            <span className="bg-finished px-4 py-1 rounded">Finished</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )

}

export default Profile;
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

    let imgSquare = '/assets/partner-square.png';

    if (stateUserLogin?.user?.image) {
        imgSquare = stateUserLogin?.user?.image;
    }

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
                            <img src={imgSquare} className="rounded img-square" />
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
                            History Transaction
                        </div>
                        <img src="../assets/ilustrasi/no-data.svg" className="img-fluid img-no-history" />
                        <div className="mb-1 text-center text-muted">
                            <i>No History Order</i>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )

}

export default Profile;
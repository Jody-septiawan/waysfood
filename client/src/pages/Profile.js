import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { Container, Row, Col, Modal } from 'react-bootstrap';
import React, { useContext, useState, useEffect } from 'react';

import { CartContext } from "../contexts/cartContext";
import { UserContext } from "../contexts/userContext";

import { useHistory, Link } from 'react-router-dom';

import { API } from "../config/api";
import { useQuery } from "react-query";

import CardHistoryOrder from '../components/CardHistoryOrder';

function Profile() {
    let history = useHistory();

    const [stateCartDetail, dispatchCartDetail] = useContext(CartContext);
    const [stateUserLogin, dispatchUserLogin] = useContext(UserContext);

    let imgSquare = "./assets/user-square.png";

    if (stateUserLogin?.user?.image) {
        imgSquare = stateUserLogin?.user?.image;
    }

    const EditProfile = () => {
        history.push('/edit-profile');
    }

    const { data: dataMyTransaction, loading, error, refetch } = useQuery(
        "myTransactionCache",
        async () => {
            const response = await API.get("my-transactions");
            return response;
        }
    );

    const MyTransaction = dataMyTransaction?.data?.data?.transaction;

    const toTransaction = (e) => {
        history.push('/Transaction/' + e);
    }
    return (
        <>
            <Container className="my-5 py-5">
                <Row>
                    <Col xs={6}>
                        <div className="playfair text-header-profile mb-4">
                            My Profile
                        </div>
                        <div className="box-img-text">
                            <img src={imgSquare} className="rounded" />
                            <span className="ml-3">
                                <div className="h5 text-rest mb-4">
                                    Full Name
                                    <div className="text-dark text-data-profile">
                                        {stateUserLogin?.user?.name}
                                    </div>
                                </div>
                                <div className="h5 text-rest mb-4">
                                    Email
                                    <div className="text-dark text-data-profile">
                                        {stateUserLogin?.user?.email}
                                    </div>
                                </div>
                                <div className="h5 text-rest mb-4">
                                    Phone
                                    <div className="text-dark text-data-profile">
                                        {stateUserLogin?.user?.phone}
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
                        {MyTransaction?.map((item, index) =>
                            <CardHistoryOrder toTransaction={toTransaction} item={item} index={index} />
                        )}
                        {MyTransaction?.length == 0 && <i className="text-muted">No History Order</i>}
                    </Col>
                </Row>
            </Container>
        </>
    )

}

export default Profile;
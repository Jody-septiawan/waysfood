import 'bootstrap/dist/css/bootstrap.min.css';
import '../Cart.css';
import { Container, Row, Col, Modal } from 'react-bootstrap';
import React, { useContext, useState, useEffect } from 'react';

import { CartContext } from "../contexts/cartContext";
import { UserContext } from "../contexts/userContext";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faPlus, faMinus, faMap, faMapMarker, faShoppingCart } from '@fortawesome/free-solid-svg-icons'

import { Link, useHistory, useParams } from 'react-router-dom';
import { useQuery, useMutation } from "react-query";

import { API } from "../config/api";
import axios from "axios";
import MapTransaction from '../components/MapTransaction';
import Rupiah from '../components/Rupiah';


function Transaction() {
    const url = 'http://localhost:5000/uploads/product/';
    let { id } = useParams();

    const [stateUser, dispatchUser] = useContext(UserContext);
    const [stateCartDetail, dispatchCartDetail] = useContext(CartContext);
    const [modalConfirm, setModalConfirm] = useState(false);
    let history = useHistory();

    const [viewport, setViewport] = useState({
        latitude: -7.803656578063965,
        longitude: 110.36375427246094,
        width: '100%',
        height: '80vh',
        zoom: 15
    });

    const Token = "pk.eyJ1Ijoiam9keXNlcHRpYXdhbiIsImEiOiJja204bHN3dGQxOTI0MnZydHR2Z2pmZWRuIn0.-BxbTvANWOYx-7gmCMDtHw";

    const [showM, setShowM] = useState(false);
    const handleCloseM = () => setShowM(false);
    const handleShowM = () => setShowM(true);
    const [showO, setShowO] = useState(false);
    const handleCloseO = () => setShowO(false);
    const handleShowO = () => setShowO(true);

    const { data: dataMyTransactionDetail, loading, error, refetch } = useQuery(
        "myTransactionDetailCache",
        async () => {
            const response = await API.get("transaction/" + id);
            return response;
        }
    );

    const myTransactionDetail = dataMyTransactionDetail?.data?.dataDetailTransaction;

    var SubTotal = 0;
    var TmpSubTotal = 0;
    var Total = 0;
    var JmlOrder = 0;

    for (var i = 0; i < myTransactionDetail?.orders?.length; i++) {
        var TmpSubTotal = 0;
        TmpSubTotal = myTransactionDetail.orders[i].product.price * myTransactionDetail.orders[i].qty
        SubTotal = SubTotal + TmpSubTotal;
        JmlOrder = JmlOrder + myTransactionDetail.orders[i].qty;
    }
    Total = SubTotal + 10000;

    const see = () => {
        handleShowO();
    }

    const waiting = () => {
        var element = document.getElementById("Waiting");
        element.classList.add("d-none");
        var element = document.getElementById("Finish");
        element.classList.remove("d-none");
    }

    const finish = useMutation(async (id) => {
        let body = {
            status: "success"
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        await API.patch("/transaction/" + id, body, config);
        refetch();
        handleCloseO();
    });

    let MyData = useQuery(
        "myDataCache",
        async () => {
            const response = await API.get("user/" + stateUser.user.id);
            return response;
        }
    );

    MyData = MyData?.data?.data?.data;

    const [locationName, setLocationName] = useState('...');
    useEffect(() => {
        axios.get("https://api.mapbox.com/geocoding/v5/mapbox.places/" + MyData?.location + ".json?types=poi&access_token=pk.eyJ1Ijoiam9keXNlcHRpYXdhbiIsImEiOiJja204bHN3dGQxOTI0MnZydHR2Z2pmZWRuIn0.-BxbTvANWOYx-7gmCMDtHw")
            .then(res => {
                setLocationName(res?.data?.features[0]?.place_name);
            });
    }, [MyData?.location]);

    const finishedOrder = () => {
        finish.mutate(myTransactionDetail.id);
    }

    return (
        <Container className="my-5">
            <Row>
                <Col md={12}>
                    <div className="text-dark playfair header-content mt-5 mb-4">
                        {myTransactionDetail?.user?.fullname}
                        {myTransactionDetail?.status == 'success' &&
                            (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="text-success bi bi-check-circle-fill mb-1 ml-2" viewBox="0 0 16 16">
                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                </svg>
                            )}
                    </div>
                    <div className="text-rest mb-1">
                        Delivery Location
                    </div>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <div className="text-rest mb-1 bg-light py-2 px-3 rounded">
                        {locationName}
                    </div>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <div className="text-rest mb-1 mt-4">
                        Review Your Order
                    </div>
                </Col>
                <Col md={7}>
                    <div className="line-cart mb-2 mt-2"></div>
                    {myTransactionDetail?.orders?.map(item =>
                        <div key={item.id}>
                            <Row className="py-2">
                                <Col xs={3}>
                                    <img src={url + item.product.image} className="img-carts bg-light rounded" />
                                </Col>
                                <Col xs={6}>
                                    <div className="playfair text-nama-menu-cart mt-3">{item.product.title}</div>
                                    <div className="mt-2">
                                        <span className="cart-qty">{item.qty}</span>
                                    </div>
                                </Col>
                                <Col xs={3}>
                                    <div className="text-danger text-right mt-3">
                                        <div>
                                            Rp. <Rupiah nominal={item.product.price} />
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <div className="line-cart my-2"></div>
                        </div>
                    )
                    }
                    {/* <pre>{JSON.stringify(myTransactionDetail, null, 2)}</pre> */}
                </Col>
                <Col md={5}>
                    <div className="line-cart my-2"></div>
                    <Row>
                        <Col xs={6}>
                            <div className="mb-2 mt-3">Subtotal</div>
                            <div className="mb-2">Qty</div>
                            <div className="mb-3">Ongkir</div>
                        </Col>
                        <Col xs={6}>
                            <div className="mb-2 mt-3 text-right text-danger">Rp <Rupiah nominal={SubTotal} /></div>
                            <div className="mb-2 text-right">{JmlOrder}</div>
                            <div className="mb-3 text-right text-danger">Rp 10.000</div>
                        </Col>
                    </Row>
                    <div className="line-cart mt-2"></div>
                    <Row>
                        <Col xs={6}>
                            <div className="mb-2 mt-1 text-total-pembayaran-cart">Total</div>
                        </Col>
                        <Col xs={6}>
                            <div className="mb-2 mt-1 text-right text-danger text-total-pembayaran-cart">Rp <Rupiah nominal={Total} /></div>
                        </Col>
                        <Col xs={6}>
                            <div className="mb-2 mt-1 text-total-pembayaran-cart">Status</div>
                        </Col>
                        <Col xs={6}>
                            {statusFormat(myTransactionDetail?.status)}
                        </Col>
                        <Col xs={12} className="text-right">
                            {myTransactionDetail?.status != 'success' &&
                                <button onClick={see} className="btn btn-sm btn-dark px-5 btn-block btn-order-cart mt-5">See How Far?</button>
                            }
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Modal show={showO} size="xl" onHide={handleCloseO} centered>
                <Modal.Body>
                    <MapTransaction partnerId={myTransactionDetail?.partnerId} finishedOrder={finishedOrder} longlat={MyData?.location} locationName={locationName} status={myTransactionDetail?.status} />
                </Modal.Body>
            </Modal>
        </Container >
    )
}

function statusFormat(status) {
    let vStatus = '';

    if (status == 'waiting') {
        vStatus = (
            <div className="mb-2 mt-1 text-right text-warning text-total-pembayaran-cart">
                Waiting
            </div>
        );
    } else if (status == 'on the way') {
        vStatus = (
            <div className="mb-2 mt-1 text-right text-info text-total-pembayaran-cart">
                On The Way
            </div>
        );
    } else if (status == 'cancel') {
        vStatus = (
            <div className="mb-2 mt-1 text-right text-danger text-total-pembayaran-cart">
                Cancel
            </div>
        );
    } else if (status == 'success') {
        vStatus = (
            <div className="mb-2 mt-1 text-right text-success text-total-pembayaran-cart">
                Success
            </div>
        );
    }


    return vStatus
}


export default Transaction;
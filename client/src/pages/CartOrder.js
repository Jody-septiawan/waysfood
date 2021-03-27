import 'bootstrap/dist/css/bootstrap.min.css';
import '../Cart.css';
import { Container, Row, Col, Modal } from 'react-bootstrap';
import React, { useContext, useState } from 'react';

import { CartContext } from "../contexts/cartContext";
import { UserContext } from "../contexts/userContext";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faPlus, faMinus, faMap, faMapMarker, faShoppingCart } from '@fortawesome/free-solid-svg-icons'

import { Link, useHistory } from 'react-router-dom';

// MapBox
import ReactMapGL from 'react-map-gl';

function CartOrder() {

    const [stateCartDetail, dispatchCartDetail] = useContext(CartContext);

    let history = useHistory();

    const [viewport, setViewport] = useState({
        latitude: -7.803656578063965,
        longitude: 110.36375427246094,
        width: '100%',
        height: '80vh',
        zoom: 15
    });

    const Token = "pk.eyJ1Ijoiam9keXNlcHRpYXdhbiIsImEiOiJja204bHN3dGQxOTI0MnZydHR2Z2pmZWRuIn0.-BxbTvANWOYx-7gmCMDtHw";

    const IncOrder = (item) => {
        dispatchCartDetail({
            type: "ADD_CART",
            payload: item
        });
    }

    const DecOrder = (item) => {
        dispatchCartDetail({
            type: "DECREMENT_CART",
            payload: item
        });
    }

    const DeleteOrder = (item) => {
        dispatchCartDetail({
            type: "DELETE_CART",
            payload: item
        });
    }

    const QtyOrder = stateCartDetail.carts.length;

    var SubTotal = 0;
    var TmpSubTotal = 0;
    var Total = 0;
    var JmlOrder = 0;

    for (var i = 0; i < QtyOrder; i++) {
        var TmpSubTotal = 0;
        TmpSubTotal = stateCartDetail.carts[i].harga * stateCartDetail.carts[i].qty
        SubTotal = SubTotal + TmpSubTotal;
        JmlOrder = JmlOrder + stateCartDetail.carts[i].qty;
    }

    Total = SubTotal + 10000;

    const [showM, setShowM] = useState(false);
    const handleCloseM = () => setShowM(false);
    const handleShowM = () => setShowM(true);
    const [showO, setShowO] = useState(false);
    const handleCloseO = () => setShowO(false);
    const handleShowO = () => setShowO(true);

    var d = new Date();

    const itemOrder = {
        status: 'finished',
        name: stateCartDetail.restaurant.nama,
        date: d.getHours() + ':' + d.getMinutes() + ' ' + d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear(),
        total: Total
    }

    const order = () => {
        handleShowO();
    }

    const waiting = () => {
        var element = document.getElementById("Waiting");
        element.classList.add("d-none");
        var element = document.getElementById("Finish");
        element.classList.remove("d-none");
    }

    const finish = (item) => {
        handleCloseO();
        dispatchCartDetail({
            type: "ADD_ORDER",
            payload: item
        });
        history.push('/profile')
    }

    if (QtyOrder == 0) {
        return (
            <div className="h4 text-rest my-5 py-5 text-center playfair">
                your cart is empty please check our product
                <Link className="text-warning ml-2" to={{ pathname: "/", }}>
                    <FontAwesomeIcon icon={faShoppingCart} />
                </Link>
            </div>
        )
    } else {
        return (
            <Container className="my-5">
                <Row>
                    <Col md={12}>
                        <div className="text-dark playfair header-content mt-5 mb-4">
                            {stateCartDetail.restaurant.nama}
                        </div>
                        <div className="text-rest mb-1">
                            Delivery Location
                    </div>
                    </Col>
                </Row>
                <Row>
                    <Col md={9}>
                        <div className="text-rest mb-1 bg-light py-2 px-3 rounded">
                            Yogyakarta
                    </div>
                    </Col>
                    <Col md={3}>
                        <button onClick={handleShowM} className="btn btn-sm btn-dark px-5 btn-order-cart py-2 btn-block">Select On Map <FontAwesomeIcon icon={faMap} /> </button>
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
                        {stateCartDetail.carts.map(item =>
                            <div key={item.id}>
                                <Row className="py-2">
                                    <Col xs={3}>
                                        <img src={item.img} className="img-carts" />
                                    </Col>
                                    <Col xs={6}>
                                        <div className="playfair text-nama-menu-cart mt-3">{item.nama}</div>
                                        <div className="mt-2">
                                            {item.qty > 1 &&
                                                <FontAwesomeIcon icon={faMinus} onClick={() => DecOrder(item)} className="text-rest icon-click" />
                                            }
                                            <span className="cart-qty">{item.qty}</span>
                                            <FontAwesomeIcon icon={faPlus} onClick={() => IncOrder(item)} className="text-rest icon-click" />
                                        </div>
                                    </Col>
                                    <Col xs={3}>
                                        <div className="text-danger text-right mt-3">
                                            <div>
                                                Rp. {item.harga}
                                            </div>
                                            <div className="mt-2">
                                                <img src='../assets/trash.png' onClick={() => DeleteOrder(item)} className="img-trash-cart icon-click" />
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <div className="line-cart my-2"></div>
                            </div>
                        )
                        }
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
                                <div className="mb-2 mt-3 text-right text-danger">Rp {SubTotal}</div>
                                <div className="mb-2 text-right">{JmlOrder}</div>
                                <div className="mb-3 text-right text-danger">Rp {QtyOrder != 0 ? 10000 : 0}</div>
                            </Col>
                        </Row>
                        <div className="line-cart mt-2"></div>
                        <Row>
                            <Col xs={6}>
                                <div className="mb-2 mt-1 text-total-pembayaran-cart">Total</div>
                            </Col>
                            <Col xs={6}>
                                <div className="mb-2 mt-1 text-right text-danger text-total-pembayaran-cart">Rp {Total == 10000 ? 0 : Total}</div>
                            </Col>
                            <Col xs={12} className="text-right">
                                <button onClick={order} className="btn btn-sm btn-dark px-5 btn-order-cart mt-5">Order</button>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Modal show={showM} size="xl" onHide={handleCloseM} centered>
                    <Modal.Body className="">

                        <ReactMapGL {...viewport} onViewportChange={viewmport => { setViewport(viewmport); }} mapStyle="mapbox://styles/jodyseptiawan/ckm8u2216elzw17rziiaoor6g" mapboxApiAccessToken={Token}>

                            <span className="box-map card-maps mb-auto mx-auto card bg-light py-2 px-3 rounded m-2 border border-success">
                                <small className="mb-2"><b>Select Delivery Location</b></small>
                                <span className="text-danger d-inline"><FontAwesomeIcon icon={faMapMarker} className="text-danger d-inline mr-1" />Yogyakarta</span>
                                <button onClick={handleCloseM} className="btn btn-sm btn-dark px-5 btn-order-cart btn-block py-1 mt-3">Confirm Location </button>
                            </span>

                        </ReactMapGL>

                    </Modal.Body>
                </Modal>

                <Modal show={showO} size="xl" onHide={handleCloseO} centered>
                    <Modal.Body>
                        <ReactMapGL className="img-fluid" {...viewport} onViewportChange={viewmport => { setViewport(viewmport); }} mapStyle="mapbox://styles/jodyseptiawan/ckm8u2216elzw17rziiaoor6g" mapboxApiAccessToken={Token}>

                            <span id="Waiting" onClick={waiting} className="box-map card-maps ml-auto card bg-light py-2 px-3 rounded m-2 border border-success icon-click">
                                <small className="mb-2"><b>Waiting for the transaction to be approved</b></small>
                                <span className="text-danger d-inline"><FontAwesomeIcon icon={faMapMarker} className="text-danger d-inline mr-1" />Yogyakarta</span>
                                <small className="mt-3"><b>Delivery Time</b></small>
                                <span>10 - 15 Minutes</span>
                            </span>

                            <span id="Finish" className="box-map card-maps ml-auto card bg-light py-2 px-3 rounded m-2 border border-success d-none">
                                <small className="mb-2"><b>Driver is On The Way</b></small>
                                <span className="text-danger d-inline"><FontAwesomeIcon icon={faMapMarker} className="text-danger d-inline mr-1" />Yogyakarta</span>
                                <small className="mt-3"><b>Delivery Time</b></small>
                                <span>10 - 15 Minutes</span>
                                <button onClick={() => finish(itemOrder)} className="btn btn-sm btn-dark px-5 btn-order-cart btn-block py-1 mt-3">Finished Order</button>
                            </span>

                        </ReactMapGL>
                    </Modal.Body>
                </Modal>
            </Container >
        )
    }

}

export default CartOrder;
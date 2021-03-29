import 'bootstrap/dist/css/bootstrap.min.css';
import '../Cart.css';
import { Container, Row, Col, Modal } from 'react-bootstrap';
import React, { useContext, useState, useEffect, useCallback } from 'react';

import { CartContext } from "../contexts/cartContext";
import { UserContext } from "../contexts/userContext";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faPlus, faMinus, faMap, faMapMarker, faShoppingCart } from '@fortawesome/free-solid-svg-icons'

import { Link, useHistory } from 'react-router-dom';
import { useMutation, useQuery } from "react-query";

import SweetAlert from 'sweetalert2-react';
import { API } from "../config/api";
import MapCart from '../components/MapCart';
import axios from "axios";
import Rupiah from '../components/Rupiah';

function CartOrder() {

    const [stateUser, dispatchUser] = useContext(UserContext);
    const [stateCartDetail, dispatchCartDetail] = useContext(CartContext);
    const [modalConfirm, setModalConfirm] = useState(false);
    let history = useHistory();

    if (stateCartDetail.restaurant == null) {
        history.push('/');
    }

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
        TmpSubTotal = stateCartDetail.carts[i].price * stateCartDetail.carts[i].qty
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
        name: stateCartDetail?.restaurant?.nama,
        date: d.getHours() + ':' + d.getMinutes() + ' ' + d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear(),
        total: Total
    }

    const order = useMutation(async () => {
        const dataProduct = stateCartDetail.carts;

        const dataProductString = JSON.stringify(dataProduct);
        const dataProductObject = JSON.parse(dataProductString);

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        let body = dataProductObject.map((item) => ({
            productId: item.id,
            qty: item.qty
        })
        );

        const parentId = stateCartDetail.restaurant.id;
        body = {
            body,
            parentId,
            price: Total
        }
        await API.post("/transaction", body, config);
        // handleShowO();
        finish();
    });

    const waiting = () => {
        var element = document.getElementById("Waiting");
        element.classList.add("d-none");
        var element = document.getElementById("Finish");
        element.classList.remove("d-none");
    }

    const finish = () => {
        dispatchCartDetail({
            type: "ADD_ORDER",
        });
        history.push('/profile')
    }

    const addOrder = () => {
        history.push('/menus');
    }


    let { data: MyData, loading, error, refetch } = useQuery(
        "myDataCache",
        async () => {
            const response = await API.get("user/" + stateUser.user.id);
            return response;
        }
    );

    MyData = MyData?.data?.data;

    const [locationName, setLocationName] = useState('...');
    useEffect(() => {
        axios.get("https://api.mapbox.com/geocoding/v5/mapbox.places/" + MyData?.location + ".json?types=poi&access_token=pk.eyJ1Ijoiam9keXNlcHRpYXdhbiIsImEiOiJja204bHN3dGQxOTI0MnZydHR2Z2pmZWRuIn0.-BxbTvANWOYx-7gmCMDtHw")
            .then(res => {
                setLocationName(res?.data?.features[0]?.place_name);
            });
    }, [MyData?.location]);

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
                            {stateCartDetail.restaurant.fullname}
                        </div>
                        <div className="text-rest mb-1">
                            Delivery Location
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md={9}>
                        <div className="text-rest mb-1 bg-light py-2 px-3 rounded">
                            {locationName}
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
                                        <img src={item.image} className="img-carts bg-light rounded" />
                                    </Col>
                                    <Col xs={6}>
                                        <div className="playfair text-nama-menu-cart mt-3">{item.title}</div>
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
                                                Rp. <Rupiah nominal={item.price} />
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
                        {/* <pre>{JSON.stringify(stateCartDetail.restaurant.fullname, null, 2)}</pre> */}
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
                                <div className="mb-3 text-right text-danger">Rp <Rupiah nominal={QtyOrder != 0 ? 10000 : 0} /></div>
                            </Col>
                        </Row>
                        <div className="line-cart mt-2"></div>
                        <Row>
                            <Col xs={6}>
                                <div className="mb-2 mt-1 text-total-pembayaran-cart">Total</div>
                            </Col>
                            <Col xs={6}>
                                <div className="mb-2 mt-1 text-right text-danger text-total-pembayaran-cart">Rp <Rupiah nominal={Total == 10000 ? 0 : Total} /> </div>
                            </Col>
                            <Col xs={12} className="text-right">
                                <button onClick={addOrder} className="btn btn-sm btn-secondary px-3 mt-5 mr-2">Add Order</button>
                                <button onClick={() => setModalConfirm(true)} className="btn btn-sm btn-dark px-5 btn-order-cart mt-5">{order?.isLoading ? (
                                    <div class="spinner-border text-light spinner-border-sm" role="status">
                                        <span class="sr-only">Loading...</span>
                                    </div>) : 'Order'}</button>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Modal show={showM} size="xl" onHide={handleCloseM} centered>
                    <Modal.Body className="">

                        <MapCart handleCloseM={handleCloseM} />

                    </Modal.Body>
                </Modal>

                <SweetAlert
                    type={'question'}
                    show={modalConfirm}
                    title="Confirm order"
                    onConfirm={() => {
                        console.log('confirm');
                        order.mutate();
                        setModalConfirm(false);
                    }}
                    confirmButtonText='Yes'
                    confirmButtonColor='#3085d6'
                    showCancelButton
                    onCancel={() => {
                        console.log('cancel');
                        setModalConfirm(false);
                    }}
                    cancelButtonColor='red'
                    onEscapeKey={() => setModalConfirm(false)}
                />
            </Container >
        )
    }

}

export default CartOrder;
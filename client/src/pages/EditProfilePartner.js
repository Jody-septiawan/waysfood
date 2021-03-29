import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { Container, Row, Col, Modal, Form, Button } from 'react-bootstrap';
import React, { useContext, useState, useEffect } from 'react';

import { UserContext } from "../contexts/userContext";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus, faMap, faMapMarker, faShoppingCart, faUpload } from '@fortawesome/free-solid-svg-icons'

import ReactMapGL from 'react-map-gl';

import { API } from "../config/api";
import { useQuery } from "react-query";
import MapEditProfile from '../components/MapEditProfile';
import axios from "axios";

function EditProfile() {

    const [stateUser, dispatchUser] = useContext(UserContext);

    const [viewport, setViewport] = useState({
        latitude: -7.803656578063965,
        longitude: 110.36375427246094,
        width: '100%',
        height: '80vh',
        zoom: 15
    });

    const Token = "pk.eyJ1Ijoiam9keXNlcHRpYXdhbiIsImEiOiJja204bHN3dGQxOTI0MnZydHR2Z2pmZWRuIn0.-BxbTvANWOYx-7gmCMDtHw";

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [DataEditProfile, setDataEditProfile] = useState([])

    const HandleEditProfile = (e) => {
        e.preventDefault();
        // console.log(e.target.elements);
        var name = e.target.elements.name.value;
        var img = e.target.elements.img.value;
        var email = e.target.elements.email.value;
        var phone = e.target.elements.phone.value;
        var address = e.target.elements.address.value;

        var data = {
            name: name,
            img: img,
            email: email,
            phone: phone,
            address: address
        }
        setDataEditProfile(data);
    }

    useEffect(() => {
        // DataEditProfile = data;

    }, [DataEditProfile]);

    const handleChange = (e) => {
        const aaaaaa = 1;
    }


    let { data: MyUserData, loading, error, refetch } = useQuery(
        "myPartnerDataCache",
        async () => {
            const response = await API.get("user/" + stateUser.user.id);
            return response;
        }
    );

    MyUserData = MyUserData?.data?.data;

    const [alamat, setAlamat] = useState('-');
    useEffect(() => {
        if (MyUserData?.location) {
            axios.get("https://api.mapbox.com/geocoding/v5/mapbox.places/" + MyUserData?.location + ".json?types=poi&access_token=pk.eyJ1Ijoiam9keXNlcHRpYXdhbiIsImEiOiJja204bHN3dGQxOTI0MnZydHR2Z2pmZWRuIn0.-BxbTvANWOYx-7gmCMDtHw")
                .then(res => {
                    setAlamat(res?.data?.features[0]?.place_name);
                });
        }
    }, [MyUserData?.location]);

    return (
        <>
            <Container className="py-5 my-5">
                <Row>
                    <Col xs={12}>
                        <div className="playfair text-header-profile mb-4">
                            Edit Profile Partner
                        </div>
                        <div>
                            <Form className="register edit-data-user" onSubmit={HandleEditProfile}>
                                <div className="box-edit-profile-grid">
                                    <div className="mr-1">
                                        <input name="name" onChange={HandleEditProfile} value={MyUserData?.fullname} type="text" placeholder="Full Name" className="form-control" />
                                    </div>
                                    <input type="file" id="upload" hidden />
                                    <label for="upload">
                                        <Container>
                                            <Row>
                                                <Col xs={10} className="text-left px-0">Attach Image </Col>
                                                <Col xs={2} className="text-right px-0"><FontAwesomeIcon icon={faUpload} /></Col>
                                            </Row>
                                        </Container>
                                    </label>
                                    {/* <div className="custom-file">
                                        <input name="img" type="text" class="form-control" value={stateUser.user.img} id="inputGroupFile01" aria-describedby="inputGroupFileAddon01" placeholder="Image" />
                                        <input name="img" type="file" onChange={handleChange} class="custom-file-input" id="inputGroupFile01" aria-describedby="inputGroupFileAddon01" />
                                        <label class="custom-file-label" for="inputGroupFile01">Attach Image</label>
                                    </div> */}
                                </div>
                                <div className="input-group pt-2">
                                    <input name="email" type="text" value={MyUserData?.email} placeholder="Email" className="form-control" />
                                </div>
                                <div className="input-group pt-2">
                                    <input name="phone" type="text" value={MyUserData?.phone} placeholder="Phone" className="form-control" />
                                </div>
                                <div className="box-edit-profile-grid pt-2">
                                    <div className="mr-1">
                                        <input name="address" value={alamat} type="text" placeholder="Location" className="form-control" />
                                    </div>
                                    <div className="custom-file">
                                        <button type="button" onClick={handleShow} className="btn btn-dark btn-sm btn-order-cart btn-block py-2">Select On Map <FontAwesomeIcon icon={faMap} /> </button>
                                    </div>
                                </div>
                                <div className="text-right mt-5">
                                    <button type="submit" className="btn btn-dark btn-sm btn-order-cart btn-save-add-product">Save</button>
                                </div>
                            </Form>
                        </div>
                    </Col>
                </Row>
                {/* <pre>{JSON.stringify(MyUserData, null, 2)}</pre> */}
            </Container>
            <Modal show={show} size="xl" onHide={handleClose} centered>
                <Modal.Body className="">
                    <MapEditProfile handleClose={handleClose} />
                </Modal.Body>
            </Modal>
        </>
    )

}

export default EditProfile;
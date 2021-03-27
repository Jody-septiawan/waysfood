import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { Container, Row, Col, Modal, Form, Button } from 'react-bootstrap';
import React, { useContext, useState, useEffect } from 'react';

import { UserContext } from "../contexts/userContext";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus, faMap, faMapMarker, faShoppingCart, faUpload, faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons'

import ReactMapGL from 'react-map-gl';

import { API } from "../config/api";
import { useQuery } from "react-query";

function AddProduct() {

    const [stateUser, dispatchUser] = useContext(UserContext);

    const [DataAddProduct, setDataAddProduct] = useState([])

    const HandleAddProduct = (e) => {
        e.preventDefault();

        var title = e.target.elements.title.value;
        var img = e.target.elements.img.value;
        var price = e.target.elements.price.value;

        var data = {
            title: title,
            img: img,
            price: price,
        }

        setDataAddProduct(data);
    }

    useEffect(() => {
        // DataAddProduct = data;

    }, [DataAddProduct]);

    const handleChange = (e) => {
        const aaaaaa = 1;
    }

    const { data: MenusData, loading, error, refetch } = useQuery(
        "userCache",
        async () => {
            const response = await API.get("products/" + stateUser.user.id);
            return response;
        }
    );

    return (
        <>
            <Container className="py-5 my-5">
                <Row>
                    <Col xs={12}>
                        <div className="playfair text-header-profile mb-4">
                            Add Product
                        </div>
                        <div>
                            <Form className="register edit-data-user" onSubmit={HandleAddProduct}>
                                <div className="box-edit-profile-grid">
                                    <div className="mr-1">
                                        <input name="title" type="text" placeholder="Title" className="form-control" />
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
                                </div>
                                <div className="input-group pt-2">
                                    <input name="price" type="text" placeholder="Price" className="form-control" />
                                </div>
                                <div className="text-right mt-4">
                                    <button type="submit" className="btn btn-dark btn-sm btn-order-cart btn-save-add-product">Save</button>
                                </div>
                            </Form>
                        </div>
                    </Col>
                    <Col xs={12}>
                        <div className="table-responsive mt-4">
                            <table class="table table-bordered table-sm">
                                <thead className="table-secondary">
                                    <tr className="text-center">
                                        <th className="border border-dark" width="2%">No</th>
                                        <th className="border border-dark" width="30%">Title</th>
                                        <th className="border border-dark" width="28%">Price</th>
                                        <th className="border border-dark" width="30%">Image</th>
                                        <th className="border border-dark text-center" width="10%">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="table-light border border-dark">
                                    {MenusData?.data?.data?.products?.map((item, index) =>
                                        <tr className="text-center">
                                            <td className="border border-dark align-middle">{index + 1}</td>
                                            <td className="border border-dark align-middle">{item.title}</td>
                                            <td className="border border-dark align-middle">Rp. {item.price}</td>
                                            <td className="border border-dark align-middle"><img className="img-add-product" src={item.image} /></td>
                                            <td className="border border-dark align-middle">
                                                <Button className="btn btn-sm btn-danger mr-3">
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </Button>
                                                <Button className="btn btn-sm btn-info">
                                                    <FontAwesomeIcon icon={faPencilAlt} />
                                                </Button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Col>
                </Row>
                <pre>{JSON.stringify(DataAddProduct, null, 2).length != 2 && JSON.stringify(DataAddProduct, null, 2)}</pre>
            </Container>
        </>
    )

}

export default AddProduct;
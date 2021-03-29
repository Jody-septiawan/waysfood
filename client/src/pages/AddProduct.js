import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { Container, Row, Col, Modal, Form, Button } from 'react-bootstrap';
import React, { useContext, useState, useEffect } from 'react';

import { UserContext } from "../contexts/userContext";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons'


import { API } from "../config/api";
import { useQuery, useMutation } from "react-query";
import TableRowProduct from '../components/TableRowProduct';

function AddProduct() {

    const [stateUser, dispatchUser] = useContext(UserContext);

    const [DataAddProduct, setDataAddProduct] = useState([]);

    const [idForUpdate, setIdForUpdate] = useState('');

    const [form, setForm] = useState({
        title: "",
        image: null,
        price: ""
    });

    const { title, image, price } = form;

    const HandleAddProduct = useMutation(async () => {
        const body = new FormData();

        body.append("title", title);
        body.append("imageFile", image);
        body.append("price", price);

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        };

        await API.post("/product", body, config);
        refetch();
        setForm({
            title: "",
            image: null,
            price: "",
        });
    });

    const deleteProduct = useMutation(async (id) => {
        await API.delete(`/product/${id}`);
        refetch();
    });

    const deleteProductById = async (id) => {
        deleteProduct.mutate(id);
    };

    const getProductById = async (id) => {
        try {
            const response = await API.get(`/product/${id}`);
            const product = response.data.data.productDetail;
            console.log(product);
            setIdForUpdate(product.id);
            setForm({
                title: product.title,
                image: product.image,
                price: product.price
            });
        } catch (error) {
            console.log(error);
        }
    };

    const onChange = (e) => {
        const tempForm = { ...form };
        tempForm[e.target.name] =
            e.target.type === "file" ? e.target.files[0] : e.target.value;
        setForm(tempForm);
    };

    const { data: MenusData, loading, error, refetch } = useQuery(
        "userCache",
        async () => {
            const response = await API.get("products/" + stateUser.user.id);
            return response;
        }
    );

    const cancelUpdate = () => {
        setIdForUpdate('');
        setForm({
            title: "",
            image: null,
            price: ""
        })
    }

    const HandleUpdateProduct = useMutation(async () => {
        const body = new FormData();

        body.append("title", title);
        body.append("imageFile", image);
        body.append("price", price);

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        };

        await API.patch("/product/" + idForUpdate, body, config);
        refetch();
        setIdForUpdate(null);
        setForm({
            title: "",
            image: null,
            price: "",
        });
    });

    return (
        <>
            <Container className="py-5 my-5">
                <Row>
                    <Col xs={12}>
                        <div className="playfair text-header-profile mb-4">
                            {idForUpdate ? 'Update product' : 'Add Product'}
                        </div>
                        <div>
                            <Form
                                className="register edit-data-user"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (idForUpdate) {
                                        HandleUpdateProduct.mutate();
                                    } else {
                                        HandleAddProduct.mutate();
                                    }
                                }}>
                                <div className="box-edit-profile-grid">
                                    <div className="mr-1">
                                        <input name="title" value={title} onChange={(e) => onChange(e)} type="text" placeholder="Title" className="form-control" />
                                    </div>
                                    <input type="file" name="image" onChange={(e) => onChange(e)} id="upload" hidden />
                                    <label for="upload">
                                        <Container>
                                            <Row>
                                                <Col xs={10} className="text-left px-0">{image ? (<span className="text-max-lenght">{idForUpdate ? image : image.name}</span>) : 'Attach Image'} </Col>
                                                <Col xs={2} className="text-right px-0"><FontAwesomeIcon icon={faUpload} /></Col>
                                            </Row>
                                        </Container>
                                    </label>
                                </div>
                                <div className="input-group pt-2">
                                    <input name="price" value={price} onChange={(e) => onChange(e)} type="number" placeholder="Price" className="form-control" />
                                </div>
                                <div className="text-right mt-4">
                                    {idForUpdate &&
                                        (<span onClick={() => cancelUpdate()} className="btn btn-danger btn-sm mr-2">Cancel</span>)
                                    }

                                    <button type="submit" disabled={title && price && image ? false : true} className="btn btn-dark btn-sm btn-order-cart btn-save-add-product">{idForUpdate ? 'Update product' : 'Save'}</button>
                                </div>
                            </Form>
                        </div>
                    </Col>
                    <Col xs={12}>
                        {MenusData ? (
                            <div className="table-responsive mt-5">
                                <table className="table table-bordered table-sm">
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
                                            <TableRowProduct
                                                product={item}
                                                index={index}
                                                deleteProductById={deleteProductById}
                                                getProductById={getProductById} />
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center mt-5">
                                <div className="spinner-border text-warning" role="status">
                                    <span class="sr-only">Loading...</span>
                                </div>
                                <div className="text-muted">
                                    Load product ...
                                </div>
                            </div>
                        )}
                    </Col>
                </Row>
                <pre>{JSON.stringify(DataAddProduct, null, 2).length != 2 && JSON.stringify(DataAddProduct, null, 2)}</pre>
            </Container>
        </>
    )

}

export default AddProduct;
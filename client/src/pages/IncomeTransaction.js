import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { useContext } from 'react';
import { useQuery, useMutation } from "react-query";
import { Container, Row, Col } from 'react-bootstrap';
import { UserContext } from "../contexts/userContext";
import { API } from "../config/api";
import axios from "axios";
import Rupiah from '../components/Rupiah';

function IncomeTransaction() {
    const [state, dispatch] = useContext(UserContext);

    const id = state.user.id;

    const { data: dataTransactionByPartnerId, loading, error, refetch } = useQuery(
        "transactionByPartnerIdCache",
        async () => {
            const response = await API.get("transactions/" + id);
            return response;
        }
    );
    let transactionByPartner = dataTransactionByPartnerId?.data?.dataTransactionPartner;


    let dataUsers = useQuery(
        "dataUsersCache",
        async () => {
            const response = await API.get("users");
            return response;
        }
    );
    dataUsers = dataUsers?.data?.data?.data;

    const getUserName = (idUser) => {
        let tmpData = dataUsers?.find(data => data.id == idUser);
        return tmpData?.fullname;
    }

    const getUserAddress = (idUser) => {
        let tmpData = dataUsers?.find(data => data.id == idUser);
        return tmpData?.location;
    }

    const actionCancel = useMutation(async (data) => {
        let body = {
            status: "cancel"
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        await API.patch("/transaction/" + data.id, body, config);
        refetch();
    });

    const approve = useMutation(async (data) => {
        let body = {
            status: "on the way"
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        await API.patch("/transaction/" + data.id, body, config);
        refetch();
    })

    const actionApprove = async (data) => {
        approve.mutate(data);
    };


    const location = (longlat) => {
        axios.get("https://api.mapbox.com/geocoding/v5/mapbox.places/" + longlat + ".json?types=poi&access_token=pk.eyJ1Ijoiam9keXNlcHRpYXdhbiIsImEiOiJja204bHN3dGQxOTI0MnZydHR2Z2pmZWRuIn0.-BxbTvANWOYx-7gmCMDtHw")
            .then(res => {
                return res?.data?.features[0]?.place_name;
            });
    }

    return (
        <>
            <Container className="py-5 my-5">
                <Row>
                    <Col xs={12}>
                        <div className="playfair text-header-profile mb-4">
                            Income Transaction
                        </div>
                        <div className="table-responsive">
                            <table class="table table-bordered">
                                <thead className="table-secondary">
                                    <tr>
                                        <th className="border border-dark" width="1%">No</th>
                                        <th className="border border-dark" width="20%">Name</th>
                                        <th className="border border-dark" width="10%">Address</th>
                                        <th className="border border-dark" width="15%">Products Order</th>
                                        <th className="border border-dark" width="15%">Price</th>
                                        <th className="border border-dark" width="9%">Status</th>
                                        <th className="border border-dark text-center" width="20%">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="table-light border border-dark">
                                    {transactionByPartner?.map((item, index) =>
                                        <tr key={index}>
                                            <td className="border border-dark">{index + 1}</td>
                                            <td className="border border-dark">{getUserName(item.userId)}</td>
                                            <td className="border border-dark">
                                                {getUserAddress(item.userId) ? location(getUserAddress(item.userId)) : '-'}
                                            </td>
                                            <td className="border border-dark">
                                                {item?.orders.map((product, index) =>
                                                (
                                                    <>
                                                        {product?.product.title}
                                                        {(index + 1) != item.orders.length && ', '}
                                                    </>
                                                )
                                                )}
                                            </td>
                                            <td className="border border-dark">
                                                Rp. <Rupiah nominal={item.price} />
                                            </td>
                                            <td className="border border-dark">
                                                {statusFormat(item.status)}
                                            </td>
                                            <td className="border border-dark">
                                                {item.status == 'waiting' ? (
                                                    <div className="text-center">
                                                        <button className="btn btn-danger btn-sm py-0 px-3 mr-2" onClick={() => actionCancel.mutate(item)}>Cancel</button>
                                                        <button className="btn btn-success btn-sm py-0 px-3" onClick={() => actionApprove(item)}>Approve</button>
                                                    </div>
                                                ) : actionFormat(item.status)}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* <pre>{JSON.stringify(transactionByPartner, null, 2)}</pre> */}
                    </Col>
                </Row>
            </Container>
        </>
    );
}

function statusFormat(status) {
    let vStatus = '';

    if (status == 'waiting') {
        vStatus = (
            <span className="text-warning">
                Waiting Approve
            </span>
        );
    } else if (status == 'on the way') {
        vStatus = (
            <span className="text-primary">
                On The Way
            </span>
        );
    } else if (status == 'cancel') {
        vStatus = (
            <span className="text-danger">
                Cancel
            </span>
        );
    } else if (status == 'success') {
        vStatus = (
            <span className="text-success">
                Success
            </span>
        );
    }


    return vStatus
}

function actionFormat(status) {
    let action = '';

    if (status == 'on the way') {
        action = (
            <div className="text-primary text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                </svg>
            </div>
        );
    } else if (status == 'cancel') {
        action = (
            <div className="text-danger text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
                </svg>
            </div>
        );
    } else if (status == 'success') {
        action = (
            <div className="text-success text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                </svg>
            </div>
        );
    }

    return action;
}

export default IncomeTransaction;

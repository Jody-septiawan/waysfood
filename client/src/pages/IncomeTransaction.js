import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

import { Container, Row, Col } from 'react-bootstrap';

import transactionData from '../components/transactionData.js';

function IncomeTransaction() {
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
                                        <th className="border border-dark">No</th>
                                        <th className="border border-dark">Name</th>
                                        <th className="border border-dark">Address</th>
                                        <th className="border border-dark">Products Order</th>
                                        <th className="border border-dark">Status</th>
                                        <th className="border border-dark text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="table-light border border-dark">
                                    {transactionData.map((item, index) =>
                                        <tr key={item.id}>
                                            <td className="border border-dark">{index + 1}</td>
                                            <td className="border border-dark">{item.name}</td>
                                            <td className="border border-dark">{item.address}</td>
                                            <td className="border border-dark">{item.product}</td>
                                            <td className="border border-dark">
                                                {item.status == 'Waiting Approve' &&
                                                    <span className="text-warning">
                                                        {item.status}
                                                    </span>
                                                }
                                                {item.status == 'Success' &&
                                                    <span className="text-success">
                                                        {item.status}
                                                    </span>
                                                }
                                                {item.status == 'Cancel' &&
                                                    <span className="text-danger">
                                                        {item.status}
                                                    </span>
                                                }
                                                {item.status == 'On The Way' &&
                                                    <span className="text-primary">
                                                        {item.status}
                                                    </span>
                                                }
                                            </td>
                                            <td className="border border-dark">
                                                {item.status == 'Waiting Approve' &&
                                                    (
                                                        <div className="text-center">
                                                            <button className="btn btn-danger btn-sm py-0 px-3 mr-2">Cancel</button>
                                                            <button className="btn btn-success btn-sm py-0 px-3">Approve</button>
                                                        </div>
                                                    )
                                                }
                                                {item.status == 'Success' &&
                                                    <div className="text-success text-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                                        </svg>
                                                    </div>
                                                }
                                                {item.status == 'Cancel' &&
                                                    <div className="text-danger text-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
                                                        </svg>
                                                    </div>
                                                }
                                                {item.status == 'On The Way' &&
                                                    <div className="text-primary text-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock-fill" viewBox="0 0 16 16">
                                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                                                        </svg>
                                                    </div>
                                                }
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default IncomeTransaction;

import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route, Link, useParams } from 'react-router-dom';
import DataMenu from '../components/Data-menu';
import { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { CartContext } from "../contexts/cartContext";
import { UserContext } from "../contexts/userContext";

import CardMenus from '../components/CardMenus';

import { API } from "../config/api";
import { useQuery } from "react-query";

function Menus() {
    let history = useHistory();

    const [state, dispatch] = useContext(CartContext);
    const [stateUser, dispatchStateUser] = useContext(UserContext);

    var MenuRest = false;

    // MenuRest = DataMenu.find(
    //     (Rest) => Rest.id === id
    // );

    const IncOrder = (item) => {
        dispatch({
            type: "ADD_CART",
            payload: item
        });
    }

    const { data: MenusData, loading, error, refetch } = useQuery(
        "MenusDataCache",
        async () => {
            const response = await API.get("products/" + state.restaurant.id);
            return response;
        }
    );

    if (!state?.restaurant?.id) {
        history.push('/');

    }

    console.log("MenusData", MenusData?.data?.data?.products.length);


    if (MenusData?.data?.data?.products.length != 0) {
        return (
            <>
                <Container className="my-5">
                    <Row>
                        <Col md={12}>
                            <div data-aos="fade-up" className="text-dark playfair header-content mt-5 mb-3">
                                {state.restaurant.fullname}, Menus
                            </div>
                        </Col>

                        {MenusData?.data?.data?.products.map(item =>
                            <Col md={3} key={item.id}>
                                <CardMenus IncOrder={IncOrder} item={item} />
                            </Col>
                        )
                        }
                    </Row>
                    {/* <Row>
                        <pre>{JSON.stringify(state.carts, null, 2)}</pre>
                    </Row> */}
                </Container>
            </>
        );
    } else {
        return (
            <>
                <div className="text-center" style={{ marginTop: '100px' }}>
                    <i className="h3">The food menu list is not available</i> <br />
                    <Link className="text-warning ml-2" to={{ pathname: "/", }}>
                        Back to Home
                    </Link>
                </div>
            </>
        )
    }
}

export default Menus;
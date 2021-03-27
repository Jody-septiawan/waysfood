import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route, Link, useParams } from 'react-router-dom';
import DataMenu from '../components/Data-menu';
import { useContext } from 'react';

import { CartContext } from "../contexts/cartContext";

import CardMenus from '../components/CardMenus';


function Menus() {

    const [state, dispatch] = useContext(CartContext);

    let { id } = useParams();

    var MenuRest = false;

    MenuRest = DataMenu.find(
        (Rest) => Rest.id === id
    );

    const IncOrder = (item) => {
        dispatch({
            type: "ADD_CART",
            payload: item
        });
    }

    if (MenuRest) {
        return (
            <>
                <Container className="my-5">
                    <Row>
                        <Col md={12}>
                            <div className="text-dark playfair header-content mt-5 mb-3">
                                {MenuRest.nama}, Menus
                        </div>
                        </Col>
                        {MenuRest.menus.map(item =>
                            <Col md={3} key={item.id}>
                                <CardMenus IncOrder={IncOrder} item={item} />
                            </Col>
                        )
                        }
                    </Row>
                    {/* <Row>
                        {JSON.stringify(state.carts.length, null, 2)}
                    </Row> */}
                </Container>
            </>
        );
    } else {
        return (
            <>
                <div className="text-center" style={{ marginTop: '100px' }}>
                    <i className="h3">Daftar menu makanan tidak tersedia</i> <br />
                    <Link className="text-warning ml-2" to={{ pathname: "/", }}>
                        Back to Home
                    </Link>
                </div>
            </>
        )
    }
}

export default Menus;
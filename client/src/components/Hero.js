import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';

function Hero() {

    return (
        <div className="mb-5 pt-5">
            <Container className="mt-5">
                <Row>
                    <Col md={7} data-aos="fade-right">
                        <div className="text-dark playfair header-hero mt-5">
                            Are You Hungry ?
                        </div>
                        <div className="text-dark playfair header-hero">
                            Express Home Delivery
                        </div>
                        <div className="row mt-4">
                            <div className="col-3 pt-2">
                                <div className="hero-line "></div>
                            </div>
                            <div className="col-7">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                            </div>
                        </div>
                    </Col>
                    <Col md={5} data-aos="zoom-in">
                        <img src="../assets/pizza.png" className="img-fluid" />
                    </Col>
                </Row>
            </Container>
        </div >
    );
}

export default Hero;

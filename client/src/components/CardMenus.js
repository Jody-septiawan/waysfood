import { Button } from 'react-bootstrap';
import Rupiah from './Rupiah';

const CardMenus = ({ item, IncOrder }) => {

    const { image, title, price } = item;

    return (
        <div className="card card-rest" data-aos="zoom-in">
            <div className="card-body p-2">
                <img src={image} className="img-fluid img-menus" />
                <div className="mt-3">
                    <div className="px-2">
                        <b className="playfair text-dark">{title}</b>
                        <p className="mb-0 text-danger">Rp. <Rupiah nominal={price} /></p>
                    </div>
                    <Button type="submit" onClick={() => IncOrder(item)} className="btn btn-sm btn-warning btn-block py-0 mt-3">Order</Button>
                </div>
            </div>
        </div>
    );
};

export default CardMenus;

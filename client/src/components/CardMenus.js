import { Button } from 'react-bootstrap';

const CardMenus = ({ item, IncOrder }) => {

    const { img, nama, harga } = item;

    return (
        <div className="card card-rest" data-aos="zoom-in">
            <div className="card-body p-2">
                <img src={img} className="img-fluid img-menus" />
                <div className="mt-3">
                    <b className="playfair text-dark">{nama}</b>
                    <p className="mb-0 text-danger">Rp. {harga}</p>
                    <Button type="submit" onClick={() => IncOrder(item)} className="btn btn-sm btn-warning btn-block py-0 mt-3">Order</Button>
                </div>
            </div>
        </div>
    );
};

export default CardMenus;

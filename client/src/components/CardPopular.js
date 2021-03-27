// import { useHistory } from "react-router-dom";
const CardPopular = ({ product, SelectRest }) => {
    // const history = useHistory();

    const { image, fullname } = product;

    return (
        <div data-aos="fade-right" data-aos-delay="300" className="card card-rest icon-click" onClick={() => SelectRest(product)}>
            <div className="card-body playfair py-3">
                <img src={image} className="img-fluid mr-3" alt="img" />
                <b className="text-dark">{fullname}</b>
            </div>
        </div>
    );
};

export default CardPopular;

const CardRestaurant = ({ product, SelectRest }) => {

    const { image, fullname } = product;

    return (
        <div data-aos="fade-right" data-aos-delay="300" className="card card-rest icon-click" onClick={() => SelectRest(product)}>
            <div className="card-body p-2 text-center">
                <img src={image} className="img-fluid img-menus" alt="img" />
                <div className="text-left text-dark ml-2 mt-2">
                    <b className="playfair">{fullname}</b>
                    <p className="mb-0">0,8</p>
                </div>
            </div>
        </div>
    );
};

export default CardRestaurant;

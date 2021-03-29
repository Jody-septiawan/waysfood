import { Container, Row, Col, Modal, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons'


const TableRowProduct = ({ product, index, deleteProductById, getProductById }) => {
    const { id, title, image, price } = product;
    return (
        <tr className="text-center">
            <td className="border border-dark align-middle">{index + 1}</td>
            <td className="border border-dark align-middle">{title}</td>
            <td className="border border-dark align-middle">Rp. {price}</td>
            <td className="border border-dark align-middle"><img className="img-add-product" src={image} /></td>
            <td className="border border-dark align-middle">
                <Button className="btn btn-sm btn-danger mr-2" onClick={() => deleteProductById(id)}>
                    <FontAwesomeIcon icon={faTrash} />
                </Button>
                <Button className="btn btn-sm btn-info" onClick={() => getProductById(id)}>
                    <FontAwesomeIcon icon={faPencilAlt} />
                </Button>
            </td>
        </tr>
    );
};

export default TableRowProduct;

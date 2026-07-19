import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, id, handleDelete }) => {
  const navigate = useNavigate();
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div id={`carouselExampleControls-${id}`} className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            {  product.images.map((image, index) => (
              <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                <img src={image} className="d-block w-100" alt={`Product ${index + 1}`}  style={{ height: "300px", width: "100%", objectFit: "cover" }}/>
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target={`#carouselExampleControls-${id}`} data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target={`#carouselExampleControls-${id}`} data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
          </button>
        </div>
        <h5 className="card-title m-0 text-truncate" data-bs-toggle="tooltip" data-bs-placement="top" title={product.name}>
          {product.name}
        </h5>
        <p className="card-text text-truncate" data-bs-toggle="tooltip" data-bs-placement="top" title={product.description}>
          {product.description}
        </p>
        <div className=" bg-body-secondary p-2 rounded">
        <p className="card-text m-0">Price: ₹{product.price.toLocaleString()}</p>
        <p className="card-text m-0">Actively Selling: {product.status ? 'Yes' : 'No'}</p>
        <p className="card-text m-0">Quantity: {product.stockQuantity}</p>
        <p className="card-text m-0">Category: {product.category}</p>
        </div>
        <div className="d-flex justify-content-between my-2">
          <button type="button" className="btn btn-outline-primary" onClick={() => navigate(`/products/edit/${product.id}`)}> <i className="bi bi-pencil me-1"></i>Edit</button>
          <button type="button" className="btn btn-outline-danger" onClick={() => handleDelete(product.id)}>
            <i className="bi bi-trash3 me-1"></i>
            Delete</button>
        </div>
      </div>
    </div>
  );
};
export default ProductCard;
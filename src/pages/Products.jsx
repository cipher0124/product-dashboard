import { Link } from "react-router-dom";
import ProductCard from "../component/ProductCard";
import { useEffect ,useState} from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
export default function Products() {
    const [search, setSearch] = useState();
    const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: "Delete Product?",
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  try {
    await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/products/${id}`);

   toast.success("Product deleted successfully.");  

    fetchProduct(); // Refresh your list
  } catch (error) {
    console.error("Failed to delete product:", error);
   toast.error("Failed to delete product. Please try again.");
  }
};
    const fetchProduct = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products`);
            setProducts(response.data);
        } catch (error) {
            console.error(error);
        }
    };
    const [products, setProducts] = useState([]);
    useEffect(() => {
        fetchProduct()
    }, []);

    useEffect(() => {
        if (!search) {
            fetchProduct();
            return;
        }
        const filteredProducts = products.filter(product =>
          Object.values(product)
    .join(" ")
    .toLowerCase()
    .includes(search.toLowerCase())
        );
        setProducts(filteredProducts);
    }, [search]);


    return (
        <div className="container py-5">
            <div className="row my-2">
                <div className="col-md-6">
                    <input type="text" className="form-control" placeholder="Search Product..."  value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="col-md-6 text-end">
                    <Link to="/products/add" className="btn btn-primary">
                        <i className="bi bi-plus-lg me-1"></i>Add Product
                    </Link>
                </div>
            </div>
            <div className="row my-2">
                <div className="row">
                    { products.length > 0 ? (
                        products.map((product, index) => (
                            <div className="col-md-4 mb-4" key={index}>
                                <ProductCard product={product} id={index + 1} handleDelete={handleDelete} />
                            </div>
                        ))
                    ) : (
                        <div className="col-12 mt-4">
                            <h5 className="text-center">No products found.</h5>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

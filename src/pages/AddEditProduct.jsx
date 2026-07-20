import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { toast } from "react-toastify";
const MAX_IMAGES = import.meta.env.VITE_MAX_IMAGES ; 

const productSchema = z.object({
  name: z.string().trim().min(2, "Product name must be at least 2 characters"),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  price: z.coerce
    .number({ invalid_type_error: "Price is required", required_error: "Price is required" })
    .positive("Price must be greater than 0"),
  stockQuantity: z.coerce
    .number({ invalid_type_error: "Stock quantity is required", required_error: "Stock quantity is required" })
    .int("Stock quantity must be a whole number")
    .nonnegative("Stock quantity cannot be negative"),
  status: z.boolean().optional().default(true),
  images: z.array(z.string()).min(1, "Please upload at least one image").max(MAX_IMAGES, `You can upload up to ${MAX_IMAGES} images`),
});

export default function AddEditProduct() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: "",
      stockQuantity: "",
      status: true,
      images: [],
    },
  });

  const uploadedImages = watch("images") || [];


  useEffect(() => {
    if (type !== "edit" || !id) return;

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products/${id}`);
        reset({
          name: response.data.name || "",
          description: response.data.description || "",
          category: response.data.category || "",
          price: response.data.price ?? "",
          stockQuantity: response.data.stockQuantity ?? "",
          status: Boolean(response.data.status),
          images: response.data.images || [],
        });
      } catch (error) {
        console.error(error);
         toast.error("Failed to load product details. Please try again later.");
      } 
    };

    fetchProduct();
  }, [id, reset, setError, type]);

  const addImageUrl = () => {
    const trimmedUrl = imageUrlInput.trim();
    if (!trimmedUrl) {
      return;
    }

    if (uploadedImages.length >= MAX_IMAGES) {
      return;
    }

    setValue("images", [...uploadedImages, trimmedUrl], { shouldValidate: true,shouldDirty: true,
      shouldTouch: true, });
     clearErrors("images");
    setImageUrlInput("");
  };

  const removeImage = (index) => {
 

    const updatedImages = uploadedImages.filter((_, imageIndex) => imageIndex !== index);
    setValue("images", updatedImages, { shouldValidate: true });
 
  };

  const onSubmit = async (data) => {
    clearErrors();
    const validatedData = productSchema.safeParse({
      ...data,
      price: Number(data.price),
      stockQuantity: Number(data.stockQuantity),
      images: uploadedImages,
    });

    if (!validatedData.success) {
      const fieldErrors = validatedData.error.flatten().fieldErrors;
      Object.entries(fieldErrors).forEach(([field, messages]) => {
        setError(field, { type: "server", message: messages?.[0] });
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        ...validatedData.data,
        status: Boolean(validatedData.data.status),
      };

      if (type === "edit" && id) {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/products/${id}`, payload);
         toast.success("Product details updated successfully.");

      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/products`, payload);
          toast.success("Product added successfully.");
      }

      navigate("/products");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save the product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between  mb-4">
            <div>
              <h2 className="mb-1">{type === "edit" ? "Edit Product" : "Add Product"}</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="row g-3">
              <div className="col-md-6 text-start">
                <label htmlFor="name" className="form-label">
                  Product Name
                </label>
                <input id="name" type="text" className={`form-control ${errors.name ? "is-invalid" : ""}`} {...register("name")} />
                {errors.name && <div className="invalid-feedback d-block">{errors.name.message}</div>}
              </div>

              <div className="col-md-6 text-start">
                <label htmlFor="category" className="form-label">
                  Category
                </label>
                <select id="category" className={`form-select ${errors.category ? "is-invalid" : ""}`} {...register("category")} defaultValue="">
                  <option value="" disabled>
                    Select category
                  </option>
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Home">Home</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Sports">Sports</option>
                </select>
                {errors.category && <div className="invalid-feedback d-block">{errors.category.message}</div>}
              </div>

              <div className="col-md-12 text-start">
                <label htmlFor="description" className="form-label">
                  Product Description
                </label>
                <textarea id="description" rows="4" className={`form-control ${errors.description ? "is-invalid" : ""}`} {...register("description")} />
                {errors.description && <div className="invalid-feedback d-block">{errors.description.message}</div>}
              </div>

              <div className="col-md-6 text-start">
                <label htmlFor="price" className="form-label">
                  Price
                </label>
                <input id="price" type="number" min="0" step="0.01" className={`form-control ${errors.price ? "is-invalid" : ""}`} {...register("price")} />
                {errors.price && <div className="invalid-feedback d-block">{errors.price.message}</div>}
              </div>

              <div className="col-md-6 text-start">
                <label htmlFor="stockQuantity" className="form-label">
                  Stock Quantity
                </label>
                <input id="stockQuantity" type="number" min="0" className={`form-control ${errors.stockQuantity ? "is-invalid" : ""}`} {...register("stockQuantity")} />
                {errors.stockQuantity && <div className="invalid-feedback d-block">{errors.stockQuantity.message}</div>}
              </div>

              <div className="col-md-6 text-start">
                <label htmlFor="status" className="form-label d-block">
                  Status
                </label>
                <div className="form-check form-switch">
                  <input id="status" className="form-check-input" type="checkbox" {...register("status")} />
                  <label className="form-check-label" htmlFor="status">
                    {watch("status") ? "Active" : "Inactive"}
                  </label>
                </div>
              </div>

              <div className="col-12 text-start">
                <label className="form-label">Product Images</label>
                <div className="input-group mt-2">
                  <input
                    type="url"
                    className="form-control"
                    placeholder="Or paste an image URL"
                    value={imageUrlInput}
                    onChange={(event) => setImageUrlInput(event.target.value)}
                  />
                  <button type="button" className="btn btn-outline-secondary" onClick={addImageUrl}>
                    Add URL
                  </button>
                </div>
                {errors.images && <div className="text-danger small mt-2">{errors.images.message}</div>}
                {uploadedImages.length > 0 && (
                  <div className="row g-3 mt-2">
                    {uploadedImages.map((image, index) => (
                      <div className="col-md-3" key={`${image}-${index}`}>
                        <div className="border rounded p-2 h-100">
                          <img src={image} alt={`Preview ${index + 1}`} className="img-fluid rounded mb-2" style={{ height: "140px", width: "100%", objectFit: "cover" }} />
                          <button type="button" className="btn btn-outline-danger btn-sm w-100" onClick={() => removeImage(index)}>
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="col-12 d-flex gap-2">
                <button type="submit" className="btn btn-primary" disabled={isSubmitting }>
                  {isSubmitting ? "Saving..." : type === "edit" ? "Update Product" : "Save Product"}
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/products")}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

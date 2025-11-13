import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { addProduct, setProductToEdit, editProduct } from '../store/slices/productSlice';
import { CATEGORIES } from '../config/generalConfig';

interface Product { _id?:string, name: string; category: string; price: number; brand: string, description: string, stock: number, image?: File, images?: string[]; }

const AddProduct: React.FC<{ productToEdit: Product | null }> = ({ productToEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: 0,
        description: '',
        brand: '',
        stock: 0,
        image: undefined as File | undefined,
    });
    const dispatch = useDispatch<AppDispatch>();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === 'price' || name === 'stock' ? Number(value) : value,
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || undefined;
        setFormData((prevData) => ({
            ...prevData,
            image: file,
        }));
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(addProduct(formData)).unwrap();
        }
        catch (error) {
            console.error("Error adding product:", error);
        }
    };

    const handleEditProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(editProduct({ ...formData, _id: productToEdit?._id })).unwrap();
        } catch (error) {
            console.error("Error editing product:", error);
        }    
    };

    const handleProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            handleEditProduct(e);
        } else {
            handleAddProduct(e)
        }
    }

    useEffect(() => {
        if (productToEdit && Object.keys(productToEdit).length > 0) {
            setFormData({
                name: productToEdit.name,
                category: productToEdit.category,
                price: productToEdit.price,
                description: productToEdit.description,
                brand: productToEdit.brand,
                stock: productToEdit.stock,
                image: undefined,
            });
            setIsEditing(true);
        }
    }, [productToEdit]);

    useEffect(() => {
        return () => {
            if(isEditing) {
                dispatch(setProductToEdit({}));
            }
        }
    },[isEditing]);

    return (
        <>
        { <h1 className="text-xl ml-6">{isEditing ? `Edit ${formData.name}` : "Add Product" }</h1> }
        <form className="p-6 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md shadow-sm border border-gray-400 h-8 p-2"
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border border-gray-400 h-8 p-2 text-sm pb-[7px] pt-[7px]"
                    required
                >
                    <option value="">Select a category</option>
                    {CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm  border border-gray-400 h-8 p-2"
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
                <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border border-gray-400 h-8 p-2"
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
                <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border border-gray-400 h-8 p-2"
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
                <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/jpeg, image/png, image/jpg"
                    onChange={handleImageChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border border-gray-400 h-8 p-2 text-sm pb-[15px]"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border border-gray-400 p-2"
                    rows={4}
                    required
                />
            </div>
        </form>

        <button
            type="button"
            className="w-full bg-indigo-600 text-white py-2 px-4 mb-10 rounded-lg hover:bg-indigo-700"
            onClick={handleProduct}
        >
            {isEditing ? "Edit Product" : "Add Product"}
        </button>
        </>
    );
};

export default AddProduct;
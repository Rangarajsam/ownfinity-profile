
import React, { useEffect, useState } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { RootState, AppDispatch } from '../store';
import { useSelector, useDispatch    } from 'react-redux'
import { listAdminProducts, setProductToEdit, deleteProduct, setUser } from '../store/slices/productSlice';
import AddProduct from '../components/addProduct';
import ProductImage from '../components/productImage';

const ProfilePage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [activeTab, setActiveTab] = useState<'personalDetails' | 'myProducts' | 'addProduct'>('personalDetails');
    const user = {isAdmin: true, name: "Admin User", email: "admin@example.com"}; //useSelector((state: RootState) => state.product.user);
    const products = useSelector((state: RootState) => state.product.adminProducts) as Array<{
        _id: string;
        name: string;
        description: string;
        price: number;
        images?: string[];
    }>;
    const productToEdit = useSelector((state: RootState) => state.product.productToEdit);
    interface Product { _id:string, name: string; category?: string; price: number; brand?: string, description: string, stock?: number, image?: File, images?: string[]; }


    const handleEditProduct = (product:Product) => {
        setActiveTab('addProduct');
        dispatch(setProductToEdit(product));
    };

    const handleDeleteProduct = async (product:Product) => {
        try {
            await dispatch(deleteProduct(product._id)).unwrap();
        } catch (error) {
            console.error('Error deleting product:', error);
            
        }
    };

    const handleListingAdminProducts = () => {
        try {
             dispatch(listAdminProducts()).unwrap();
        } catch (error) {
            console.error('Error fetching admin products:', error);
        }
    }

    useEffect(() => {
        const userInfo = {isAdmin: true, name: "Admin User", email: "admin@example.com"}
        dispatch(setUser(userInfo));
        userInfo?.isAdmin && activeTab === 'myProducts' && handleListingAdminProducts();
    }, [activeTab]);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    onClick={() => setActiveTab('personalDetails')}
                    className={`px-4 py-2 text-sm font-medium ${
                        activeTab === 'personalDetails'
                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Personal Details
                </button>
                {user?.isAdmin && <button
                    onClick={() => setActiveTab('myProducts')}
                    className={`px-4 py-2 text-sm font-medium ${
                        activeTab === 'myProducts'
                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    My Products
                </button>}

                {user?.isAdmin && <button
                    onClick={() => setActiveTab('addProduct')}
                    className={`px-4 py-2 text-sm font-medium ${
                        activeTab === 'addProduct'
                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                   Handle Product
                </button>}
            </div>

            {activeTab === 'personalDetails' && user && (
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h2>
                    <p className="text-gray-700">Name: {user.name}</p>
                    <p className="text-gray-700">Email: {user.email}</p>
                    <p className="text-gray-700">Phone: {user.mobileNumber}</p>
                </div>
            )}

            {activeTab === 'myProducts' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.length === 0 && (
                        <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center">
                            <p className="text-gray-600">No products available.</p>
                        </div>
                    )}
                    {products.length > 0 && products.map((product) => (
                        <div key={product._id} className="bg-white p-4 rounded-lg shadow mb-10">
                            <ProductImage width={300} height={300} imageUrl={product.images?.[0] || ""} imageAlt={product.name || "no image available"} />
                            <h2 className="mt-4 text-lg font-semibold text-gray-900">{product.name}</h2>
                            <p className="mt-2 text-gray-700">{product.description}</p>
                            <p className="mt-2 text-lg font-bold text-gray-900">${product.price.toFixed(2)}</p>
                            <div className="flex w-full justify-between">
                            <button
                                onClick={() => handleEditProduct(product)}
                                className="mt-4 flex items-center justify-center w-[55%] bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
                            >
                                <PencilIcon className="w-5 h-5 mr-2" />
                                Edit Product
                            </button>
                            <button
                                onClick={() => handleDeleteProduct(product)}
                                className="mt-4 flex items-center justify-center w-[40%] bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
                            >
                                <TrashIcon className="w-5 h-5 mr-2" />
                                Delete
                            </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'addProduct' && (
                <AddProduct productToEdit={productToEdit} />
            )}
        </div>
    );
};

export default ProfilePage;
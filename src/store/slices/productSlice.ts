import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../../config/generalConfig";
import { getAuthToken } from "../../utils/authUtils";
import api from "../../utils/axios";
import axios from "axios";

let isSearchQuery = false;

export const listAllProducts = createAsyncThunk<
any, 
string | undefined, 
{
    state: any;
    rejectValue: string;
}
>(
    "product/listAllProducts",
    async (queries, { rejectWithValue, getState }) => {
        try {
            const state = getState() as any;
            const token = getAuthToken(state);
            if(queries?.includes("search")) {
                isSearchQuery = true;
            }
            if (!token) {
                throw new Error("No token found, user is not logged in.");
            }
            const response = await axios.get(`${API_URL}/products${queries || ''}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data || "Failed to fetch products");
        }
    }
);

export const listAdminProducts = createAsyncThunk(
    "product/listAdminProducts",
    async (_, { rejectWithValue, getState }) => {
        try {
            const state = getState() as any;
            const token = getAuthToken(state)
            if (!token) {
                throw new Error("No token found, user is not logged in.");
            }
            const response = await axios.get(`${API_URL}/myProducts`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data || "Failed to fetch products");
        }
    }
);

const handleS3Upload = async (product:Product, token:string, ) => {
    const computeSha256 = async (file:File) => {
        const buffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
        const checksum = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
        return checksum;
    }

    const checksum = await computeSha256(product.image as File);
    
    const urlResponse = await axios.post(`${API_URL}/s3/signedUrl`, 
        {name: product.name, type:product.image?.type, size:product.image?.size, checksum}, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    try {
        await axios.put(urlResponse.data.url, product.image, {
            headers: {
                "Content-Type": product.image?.type
            }
        });
    } catch (error) {
        console.error("Error uploading image:", error);
    }

    const imageUrl = urlResponse.data.url.split("?")[0];
    delete product.image;
    product.images = [imageUrl];
    return product
}

interface Product { _id?:string, name: string; category: string; price: number; brand: string, description: string, stock: number, image?: File, images?: string[]; }
    
export const addProduct = createAsyncThunk(
    "product/addProduct",
    async (product: Product, { rejectWithValue, getState }) => {
        try {
            const state = getState() as any;
            const token = getAuthToken(state)
            if (!token) {
                throw new Error("No token found, user is not logged in.");
            }
            const productToAdd = product.image ? await handleS3Upload(product, token) : product;
            const response = await api.post(`${API_URL}/products`, productToAdd , {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data || "Failed to add product");
        }
    }
);

export const editProduct = createAsyncThunk(
    "product/editProduct",
    async (product: Product, { rejectWithValue, getState }) => {
        try {
            const state = getState() as any;
            const token = getAuthToken(state)
            if (!token) {
                throw new Error("No token found, user is not logged in.");
            }
            const productToEdit = product.image ? await handleS3Upload(product, token) : product;
            const productToSend = { ...productToEdit };
            delete productToSend._id;
            const response = await axios.patch(`${API_URL}/products/${product._id}`, productToSend, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data || "Failed to edit product");
        }
    }
);

export const deleteProduct = createAsyncThunk(
    "product/deleteProduct",
    async (productId: string, { rejectWithValue, getState }) => {
        try {
            const state = getState() as any;
            const token = getAuthToken(state)
            if (!token) {
                throw new Error("No token found, user is not logged in.");
            }
            const response = await axios.delete(`${API_URL}/products/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data || "Failed to delete product");
        }
    }
);

export const getProductById = createAsyncThunk(
    "product/getProductById",
    async (productId: string, { rejectWithValue, getState }) => {
        try {
            const state = getState() as any;
            const token = getAuthToken(state)
            if (!token) {
                throw new Error("No token found, user is not logged in.");
            }
            const response = await axios.get(`${API_URL}/products/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data || "Failed to fetch product");
        }
    }
);

const productSlice = createSlice({
    name: "product",
    initialState: {
        user: null as unknown | null,
        products: [] as Product[],
        loading: false,
        error: null as unknown | null,
        selectedProduct: null as unknown | null,
        productToBuy: [] as Product[],
        adminProducts: [] as Product[],
        productToEdit: {} as Product,
        productSearchQuery: "",
        searching: false,
    },
    reducers: {
        setSelectedProduct: (state, action) => {
            state.selectedProduct = action.payload;
        },
        setBuyProduct: (state, action) => {
            state.productToBuy = action.payload;
        },
        setProductToEdit: (state, action) => {
            state.productToEdit = action.payload;
        },
        setProductSearchQuery: (state, action) => {
            state.productSearchQuery = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(listAllProducts.pending, (state) => {
                state.searching = true
                state.loading = true;
                state.error = null;
                isSearchQuery = false;
            })
            .addCase(listAllProducts.fulfilled, (state, action) => {
                if (action.payload.type === "list") {
                    state.loading = false;
                    state.products = action.payload.products;
                }
                else {
                    isSearchQuery = false;
                    state.loading = false;
                }
            })
            .addCase(listAllProducts.rejected, (state, action) => {
                state.loading = false;
                isSearchQuery = false;
                state.error = action.payload as unknown;
            }).addCase(listAdminProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            }).addCase(listAdminProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.adminProducts = action.payload;
            }).addCase(listAdminProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as unknown;
            }).addCase(addProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            }).addCase(addProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = [...state.products, action.payload];
            }).addCase(addProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as unknown;
            }).addCase(editProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            }).addCase(editProduct.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.products.findIndex((product) => product._id === action.payload._id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            }).addCase(editProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as unknown;
            }).addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            }).addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = state.products.filter((product) => product._id !== action.payload._id);
                state.adminProducts = state.adminProducts.filter((product) => product._id !== action.payload._id);
            }).addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as unknown;
            }).addCase(getProductById.pending, (state) => {
                state.loading = true;
                state.error = null;
            }).addCase(getProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedProduct = action.payload;
            }).addCase(getProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as unknown;
            })
    },
});

export const { setSelectedProduct, setBuyProduct, setProductToEdit, setProductSearchQuery, setUser } = productSlice.actions;

export default productSlice.reducer;
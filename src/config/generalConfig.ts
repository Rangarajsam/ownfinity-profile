const isDevelopment = process.env.NODE_ENV === 'development';

export const API_URL = isDevelopment 
  ? process.env.OWNFINITY_DEV_API_URL
  : process.env.OWNFINITY_PROD_API_URL;


export const CATEGORIES = [
    "Electronics",
    "Fashion",
    "Home & Furniture",
    "Grocery",
    "Beauty & Health",
    "Sports & Fitness",
    "Automotive",
    "Books & Stationery",
    "Baby & Kids",
    "Handmade & Craft"
]

export default {
    API_URL,
    CATEGORIES
}

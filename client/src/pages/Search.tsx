import axios from "axios";
import { useEffect, useState } from "react";
import { api } from "../Api";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";
import { motion } from 'framer-motion'
interface Product {
    _id: string;
    productName: string;
    price: string;
    photo: string;
    discountPrice: string
}
const Search = () => {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState<string>('')


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${api}/productFind`);
                setAllProducts(response.data);
                setLoading(false)
            } catch (error) {
                console.log(error);
            }
        };
        fetchProducts();
    }, []);

    const sliceLimit = 3

    const searchFilter = allProducts
        .filter((p) => p.productName.toLowerCase().includes(search.toLowerCase()))
        .slice(0, sliceLimit);


    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="search_container">
            <div>
                <input type="text" placeholder="Search Product"
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {
                loading ? (
                    <Loading />
                ) : searchFilter.length === 0 ? (
                    <p>Product Not Found</p>
                ) : (
                    searchFilter.map((product) => (
                        <div key={product._id}>
                            <Link to={`/productDetails/${product._id}`}>

                                <div className="product_img">
                                    <img
                                        src={`${api}/photo/${product.photo[0]}`}
                                        alt={product.productName}
                                    />
                                    <p>{product.productName}</p>
                                </div>
                            </Link>
                        </div>
                    ))
                )
            }
        </motion.div>
    )
}

export default Search
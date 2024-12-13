import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { FaUser, FaShoppingCart, FaSearch } from "react-icons/fa"; // Icons
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { getCategories } from "../lib/admin/category";
import { getCartByUserId } from "@/lib/user/cart";

export default function Navbar() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [categories, setCategories] = useState([]);
    const [cartCount, setCartCount] = useState(0); // Cart count state
    const [selectedCategory, setSelectedCategory] = useState(""); // Track selected category
    const pathname = usePathname(); // Get the current path
    const router = useRouter();

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            const responseData = data.data;
            setCategories(responseData);
        } catch (error) {
            toast.error("Failed to fetch categories");
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = jwtDecode(token);
            setIsLoggedIn(!decoded.isAdmin); // Logged in only if not admin
            setUser(decoded);
            setUserId(decoded.id);
        }

        const fetchCartCount = async () => {
            try {
                if (!token) return;
                const decoded = jwtDecode(token);
                if (!decoded.isAdmin) {
                    setIsLoggedIn(true);
                    setUser(decoded);
                    setUserId(decoded.id);
                }

                const cartItems = await getCartByUserId(decoded.id);
                const totalCount = cartItems.reduce(
                    (count, item) => count + item.quantity,
                    0
                );
                setCartCount(totalCount);
            } catch (error) {
                console.error("Failed to fetch cart count:", error.message);
            }
        };

        fetchCategories();
        fetchCartCount();
    }, [pathname]);

    const handleSearch = () => {
        if (!searchTerm) {
            toast.error("Please enter a search term.");
            return;
        }
        router.push(`/search?query=${searchTerm}`);
    };

    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        setSelectedCategory(categoryId); // Update the selected category state
        if (categoryId) {
            if (isLoggedIn) {
                router.push(`/user/products?categoryId=${categoryId}`);
            } else {
                router.push(`/products?categoryId=${categoryId}`);
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUser(null);
        toast.success("Logged out successfully!");
        router.push("/");
    };

    return (
        <nav className="bg-red-600 text-white p-4 fixed top-0 left-0 w-full z-50">
            <div className="max-w-screen-xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link
                    href={isLoggedIn ? "/user/home" : "/"}
                    className="text-2xl font-bold flex items-center space-x-2 text-white"
                >
                    <span className="text-xl">R-</span>
                    <span className="font-extrabold">Sports</span>
                </Link>

                {/* Categories Dropdown */}
                <div className="relative">
                    <select
                        className="p-2 rounded-md bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                        onChange={handleCategoryChange}
                        value={selectedCategory} // Display the selected category here
                    >
                        <option value="" disabled>
                            Select Category
                        </option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Search Bar */}
                <div className="relative w-1/3">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search Products..."
                        className="p-2 w-full rounded-l-md border-none text-black"
                    />
                    <button
                        onClick={handleSearch}
                        className="absolute right-0 p-2 bg-yellow-500 text-red-600 rounded-r-md"
                    >
                        <FaSearch />
                    </button>
                </div>

                {/* User Actions */}
                <div className="flex items-center space-x-4">
                    {!isLoggedIn ? (
                        // Show Login button only if not on the login page
                        pathname !== "/login" && (
                            <Link
                                href="/login"
                                className="flex items-center space-x-2 text-white"
                            >
                                <span>Login</span>
                            </Link>
                        )
                    ) : (
                        <>
                            {/* Show Cart and Profile if logged in */}
                            <div className="flex items-center space-x-2">
                                <Link
                                    href="/profile"
                                    className="flex items-center space-x-1 text-white"
                                >
                                    <FaUser />
                                    <span>{user?.username || "Profile"}</span>
                                </Link>
                                <Link
                                    href="/user/cart"
                                    className="flex items-center space-x-1 text-white"
                                >
                                    <FaShoppingCart />
                                    <span>Cart ({cartCount})</span>
                                </Link>
                                <Link
                                    href="/user/order-history"
                                    className="flex items-center space-x-1 text-white"
                                >
                                    <span>Order History</span>
                                </Link>
                            </div>

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-4 py-2 rounded flex items-center space-x-2"
                            >
                                <span>Logout</span>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

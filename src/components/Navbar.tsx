import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/redux";
import type { RootState } from "../store";
import "../styles/Navbar.css";
import { logout } from "../store/authSlice";
import { fetchCategories } from "../store/categorySlice";

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state: RootState) => state.auth);
    const cartItems = useAppSelector((state: any) => state.cart.items || []);
    const { categories } = useAppSelector((state: RootState) => state.categories);
    // const [searchValue, setSearchValue] = useState("");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    // const handleSearch = (e: React.FormEvent) => {
    //     e.preventDefault();
    //     if (searchValue.trim()) {
    //         navigate(`/search?q=${searchValue.trim()}`);
    //         setSearchValue("");
    //         setMobileMenuOpen(false);
    //     }
    // };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
        setMobileMenuOpen(false);
    };

    return (
        <>
            {/* Navbar fixe */}
            <header className="navbar">
                <div className="navbar-container">

                    {/* Logo */}
                    {/* <div style={{ position: 'relative' }}> */}
                    <Link to="/" className="navbar-logo">
                        <img src="/images/logocover.PNG" alt="" width={100} />
                    </Link>
                    {/* <img style={{ position: 'absolute' }} src="/images/logo.png" alt="" width={20} /> */}
                    {/* </div> */}

                    {/* Menu Desktop */}
                    <nav className="navbar-menu-desktop">
                        <Link to="/">Accueil</Link>
                        {categories.map((category) => (
                            <Link key={category._id} to={`/category/${category._id}`}>
                                {category.name}
                            </Link>
                        ))}
                        <Link to="/news">News</Link>
                    </nav>

                    {/* Actions à droite */}
                    <div className="navbar-actions">

                        {/* Recherche Desktop */}
                        {/* <form onSubmit={handleSearch} className="navbar-search-desktop">
                            <input
                                type="text"
                                placeholder="Rechercher un produit..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                            <button type="submit">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.35-4.35" />
                                </svg>
                            </button>
                        </form> */}

                        {/* Panier */}
                        <button
                            className="navbar-icon-btn"
                            onClick={() => navigate("/cart")}
                        >
                            <span className="navbar-cart-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="9" cy="21" r="1" />
                                    <circle cx="20" cy="21" r="1" />
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                </svg>
                                {cartItems.length > 0 && (
                                    <span className="navbar-cart-badge">{cartItems.length}</span>
                                )}
                            </span>
                        </button>

                        {/* Menu utilisateur */}
                        <div className="navbar-user-menu">
                            <button className="navbar-icon-btn">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </button>

                            <div className="navbar-dropdown">
                                {user ? (
                                    <>
                                        <Link to="/account" onClick={() => setMobileMenuOpen(false)}>
                                            Mon compte
                                        </Link>
                                        <button onClick={handleLogout} className="navbar-dropdown-item">
                                            Déconnexion
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                            Connexion
                                        </Link>
                                        <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                                            Inscription
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Bouton menu mobile */}
                        <button
                            className="navbar-mobile-toggle"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M3 12h18M3 6h18M3 18h18" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* Menu Mobile (Sidebar) */}
            <div className={`navbar-mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
                <div className="navbar-mobile-header">
                    <div style={{ position: 'relative' }}>
                        <Link to="/" className="navbar-logo">
                            {/* NEMEZ */}
                            <img src="/images/logocover.PNG" alt="" width={100} />
                            <img style={{ position: 'absolute' }} src="/images/logo.png" alt="" width={20} />
                        </Link>
                    </div>
                    <button className="close-btn" onClick={() => setMobileMenuOpen(false)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <nav className="navbar-mobile-links">
                    <Link to="/" onClick={() => setMobileMenuOpen(false)}>Accueil</Link>
                    {categories.map((category) => (
                        <Link
                            key={category._id}
                            to={`/category/${category._id}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {category.name}
                        </Link>
                    ))}
                    <Link to="/news" onClick={() => setMobileMenuOpen(false)}>News</Link>
                </nav>

                {/* <form onSubmit={handleSearch} className="navbar-mobile-search">
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <button type="submit">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                    </button>
                </form> */}

                <div className="navbar-mobile-user">
                    {user ? (
                        <>
                            <Link to="/account" onClick={() => setMobileMenuOpen(false)}>Mon compte</Link>
                            <button onClick={handleLogout}>Déconnexion</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Connexion</Link>
                            <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>Inscription</Link>
                        </>
                    )}
                </div>
            </div>

            {/* Overlay sombre quand menu ouvert */}
            {mobileMenuOpen && (
                <div className="navbar-overlay" onClick={() => setMobileMenuOpen(false)}></div>
            )}

            {/* Espace pour compenser la navbar fixe */}
            <div style={{ height: 80 }}></div>
        </>
    );
};

export default Navbar;
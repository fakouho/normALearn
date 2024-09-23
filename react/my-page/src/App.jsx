import React, { useEffect, useState, useCallback } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './fonts.css';
import Search from "./pages/Search";
import Bookmark from "./pages/Bookmark";
import Counter from "./pages/Counter";
import Loginpage from "./Loginpage";
import Sidedown from "./pages/Sidedown";
import { useCookies } from 'react-cookie';
import Pwch from "./pages/Pwch";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [companyName, setCompanyName] = useState('');
    const [moll, setMoll] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cookies, removeCookie] = useCookies(['userId']);
    const [userId, setUserId] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [start, setStart] = useState([]);
    const [results, setResults] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('isLoggedIn');
        removeCookie('userId');
        setIsLoggedIn(false);
        navigate('/login');
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const cookieId = cookies.userId;

    useEffect(() => {
        if (!cookieId) {
            console.error('자동로그아웃 작동 다시 로그인하세요.');
            navigate('/login');
        } else {
            setUserId(cookieId);
        }
    }, [cookieId, navigate]);

    useEffect(() => {
        const savedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (savedUserInfo) {
            setIsLoggedIn(true);
            setCompanyName(savedUserInfo.companyName);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const fetchData = useCallback(() => {
        const url = `http://localhost:8080/NomAlearn/getListOutput?userId=${cookieId}`;
        fetch(url)
            .then(response => response.json())
            .then(moll => {
                setMoll(moll);
            })
            .catch(error => console.error('ERROR:', error));
    }, [cookieId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (location.pathname === '/App/Bookmark' || location.pathname === '/App/counter') {
            fetchData();
        }
    }, [location.pathname, fetchData]);

    const handleResults = (results) => {
        setResults(results);
    };

    return (
        <div className="App">
            {isLoggedIn ? (
                <>
                    <nav className="main-menu">
                        <div className="side-top">
                            <ul className="user-info">
                                <li className="user-name">
                                    <p>{companyName}</p>
                                    <i className="fa fa-angle-right"></i>
                                </li>
                                <li className="user-actions">
                                    <p onClick={handleOpenModal}>비밀번호 변경</p>
                                    <p> | </p>
                                    <p onClick={handleLogout}>logout</p>
                                </li>
                            </ul>
                            <ul className="top-ul">
                                <li>
                                    <Link to="/App/">
                                        <i className="fa fa-search"></i>
                                        <span className="nav-text">검색 페이지</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/App/Bookmark">
                                        <i className="fa fa-bookmark"></i>
                                        <span className="nav-text">북마크 페이지</span>
                                    </Link>
                                </li>
                                <li className="darkerlishadow">
                                    <Link to="/App/counter">
                                        <i className="fa fa-wrench"></i>
                                        <span className="nav-text">모델관리 페이지</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="scrollbar" id="style-1">
                            <Sidedown 
                                setSelectedItem={setSelectedItem} 
                                setStart={setStart} 
                                onResults={handleResults}
                            />
                        </div>
                    </nav>
                    <div className="content-container">
                        <Routes>
                            <Route 
                                path="/" 
                                element={
                                    <Search 
                                        onStartChange={() => {}} 
                                        selectedItem={selectedItem}
                                        setSelectedItem={setSelectedItem}
                                        start={start}
                                        setStart={setStart}
                                        results={results}
                                        setResults={setResults}
                                    />
                                } 
                            />
                            <Route path="/Bookmark" element={<Bookmark moll={moll} fetchData={fetchData} />} />
                            <Route path="/counter" element={<Counter moll={moll} />} />
                        </Routes>
                        
                    </div>
                    <Pwch 
                        isOpen={isModalOpen} 
                        onRequestClose={handleCloseModal} 
                        userId={userId} 
                    />
                </>
            ) : (
                <Routes>
                    <Route path="/login" element={<Loginpage setIsLoggedIn={setIsLoggedIn} />} />
                    <Route path="*" element={<Loginpage setIsLoggedIn={setIsLoggedIn} />} />
                </Routes>
            )}
        </div>
    );
}

export default App;

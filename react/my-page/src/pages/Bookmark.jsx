import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Bookmark.css';
import '../fonts.css';
import InputModal from './InputModal';
import '../App.css';

const SvgButton = ({ rank, isFavorite, onClick, outputIdx }) => {
    const [color, setColor] = useState(isFavorite ? '#f7e600' : '#ddd');

    useEffect(() => {
        setColor(isFavorite ? '#f7e600' : '#ddd');
    }, [isFavorite]);

    const handleClick = (event) => {
        event.preventDefault();
        const newColor = color === '#f7e600' ? '#ddd' : '#f7e600';
        setColor(newColor);
        onClick(rank, newColor, outputIdx);
    };

    return (
        <svg
            onClick={handleClick}
            version="1.0"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            style={{ width: '24px', height: '24px', cursor: 'pointer' }}
        >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
                <path
                    fill={color}
                    d="M62.799,23.737c-0.47-1.399-1.681-2.419-3.139-2.642l-16.969-2.593L35.069,2.265 
                    C34.419,0.881,33.03,0,31.504,0c-1.527,0-2.915,0.881-3.565,2.265l-7.623,16.238L3.347,21.096
                    c-1.458,0.223-2.669,1.242-3.138,2.642c-0.469,1.4-0.115,2.942,0.916,4l12.392,12.707l-2.935,17.977
                    c-0.242,1.488,0.389,2.984,1.62,3.854c1.23,0.87,2.854,0.958,4.177,0.228l15.126-8.365l15.126,8.365
                    c0.597,0.33,1.254,0.492,1.908,0.492c0.796,0,1.592-0.242,2.269-0.72c1.231-0.869,1.861-2.365,1.619-3.854
                    l-2.935-17.977l12.393-12.707C62.914,26.68,63.268,25.138,62.799,23.737z"
                ></path>
            </g>
        </svg>
    );
};

const Bookmark = ({ moll, fetchData }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState({});
    const [isFetching, setIsFetching] = useState(false);
    const [localMoll, setLocalMoll] = useState([]);
    const [renderTrigger, setRenderTrigger] = useState(0);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState({});

    const itemsPerPage = 10;

    const fetchMollData = useCallback(() => {
        const filteredMoll = moll.filter(item => item.myPage === 'Y');
        setLocalMoll(filteredMoll);
    }, [moll]);

    useEffect(() => {
        fetchMollData();
    }, [moll, renderTrigger, fetchMollData]);

    const handleDetailClick = (item) => {
        setModalData(item);
        setShowModal(true);
    };

    const handlePrevClick = (event) => {
        event.preventDefault();
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextClick = (event) => {
        event.preventDefault();
        if (currentPage < Math.ceil(localMoll.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePageClick = (event, pageNumber) => {
        event.preventDefault();
        setCurrentPage(pageNumber);
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(localMoll.length / itemsPerPage); i++) {
            pageNumbers.push(i);
        }
        return pageNumbers.map((number) => (
            <li key={number} className={number === currentPage ? 'active' : ''}>
                <button id={number} onClick={(event) => handlePageClick(event, number)}>
                    {number}
                </button>
            </li>
        ));
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = localMoll.slice(indexOfFirstItem, indexOfLastItem);

    const postData = async (url, data) => {
        try {
            setIsFetching(true);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            await fetchData(); // Fetch updated list after changing bookmark
        } catch (error) {
            console.error(error);
        } finally {
            setIsFetching(false);
        }
    };

    const handleBookmarkClick = (rank, newColor, outputIdxValue) => {
        if (outputIdxValue !== undefined) {
            const updatedData = { outputIdx: outputIdxValue, work: 'ChangeMypage' };
            postData('http://localhost:8080/NomAlearn/sendListResult', updatedData);
        } else {
            console.warn('outputIdx 값이 정의되어 있지 않습니다. 데이터 전송을 건너뜁니다.');
        }
    };

    const handleEditClick = (item) => {
        setEditData(item);
        setShowEditModal(true);
    };

    const handleEditModalClose = async () => {
        setLocalMoll(prev => prev.map(item => (item.outputIdx === editData.outputIdx ? editData : item)));
        editData.work = 'updateProductName';
        const postData = { ...editData };

        try {
            const response = await fetch('http://localhost:8080/NomAlearn/sendListOutput', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error sending data:', error);
        }

        setShowEditModal(false);
    };

    return (
        <div className="bookmark-wrap">
            <div className="bookmark-area">
                <h2>북마크</h2>
                <table className="bookmark-group">
                    <thead>
                        <tr className="spaced-title">
                            <th className="rank-column">즐겨찾기</th>
                            <th>인장강도</th>
                            <th>항복강도</th>
                            <th>경도</th>
                            <th>연신율</th>
                            <th>제품이름</th>
                            <th>상세보기</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item, index) => (
                            <tr key={item.outputIdx || index}>
                                <td>
                                    <SvgButton
                                        rank={item.rank}
                                        isFavorite={item.myPage === 'Y'}
                                        onClick={handleBookmarkClick}
                                        outputIdx={item.outputIdx}
                                    />
                                </td>
                                <td>{item.tensileStrengthResult}</td>
                                <td>{item.yieldStrengthResult}</td>
                                <td>{item.hardnessResult}</td>
                                <td>{item.elongationResult}</td>
                                <td>
                                    <div className="flex-container">
                                        <div className='pro-name'>
                                            {item.productName}
                                        </div>
                                        <button className="btn btn-secondary ml-2" onClick={() => handleEditClick(item)}>
                                            수정
                                        </button>
                                    </div>
                                </td>
                                <td>
                                    <button className="btn btn-primary" onClick={() => handleDetailClick(item)}>
                                        상세보기
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {localMoll.length === 0 && (
                    <div className="empty-message">즐겨찾기 항목이 없습니다.</div>
                )}
                <div className="pagination">
                    <ul>
                        <li className={currentPage === 1 ? 'disabled' : ''}>
                            <button onClick={handlePrevClick}>
                                &laquo; Prev
                            </button>
                        </li>
                        {renderPageNumbers()}
                        <li className={currentPage === Math.ceil(localMoll.length / itemsPerPage) ? 'disabled' : ''}>
                            <button onClick={handleNextClick}>
                                Next &raquo;
                            </button>
                        </li>
                    </ul>
                </div>
                {isFetching ? <p>데이터를 가져오는 중...</p> : null}
            </div>
            <InputModal
                show={showModal}
                onClose={() => setShowModal(false)}
                data={modalData}
            />
            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>수정</h2>
                        <input
                            type="text"
                            placeholder="제품 이름"
                            value={editData.productName}
                            onChange={(e) => setEditData({ ...editData, productName: e.target.value })}
                        />
                        <div className="button-container">
                            <button className="btn btn-primary" onClick={handleEditModalClose}>
                                저장
                            </button>
                            <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Bookmark;

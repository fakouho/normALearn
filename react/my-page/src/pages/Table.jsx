import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Table.css';
import '../fonts.css';

const Table = ({ setSelectedItem, start }) => {
    const [list, setList] = useState([]);
    
    useEffect(() => {
        setList(start); 
        setTimeout(() => {           
            const detailButton = document.querySelector('.btn.btn-primary');            
            if (detailButton) {
                detailButton.click(); 
            }
        }, 100);
    }, [start]);

    const handleViewDetails = (item) => {
        setSelectedItem(item); 
    };

    return (
        <div className="table-wrap">
            <div className="table-area">
                <table className="table-group">
                    <thead>
                        <tr className="spaced-title">
                            <th className="rank-column">목차</th>
                            <th>인장강도</th>
                            <th>항복강도</th>
                            <th>경도</th>
                            <th>연신율</th>
                            <th>조성</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((item, index) => (
                            <tr key={index}>
                                <td className="rank-column-td">{index + 1}</td>
                                <td>{item.tensileStrengthResult}</td>
                                <td>{item.yieldStrengthResult}</td>
                                <td>{item.hardnessResult}</td>
                                <td>{item.elongationResult}</td>
                                <td>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleViewDetails(item)}
                                    >
                                        상세보기
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;

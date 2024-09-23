import React, { useState, useEffect, useCallback } from 'react';
import { useCookies } from 'react-cookie';
import { RotatingSquare } from 'react-loader-spinner'; 
import './searchsub.css';

const SearchSub = ({ onResults, setStart, setInfoData }) => {
  const [cookies] = useCookies(['userId']);
  const [tensileStrength, setTensileStrength] = useState('');
  const [yieldStrength, setYieldStrength] = useState('');
  const [hardness, setHardness] = useState('');
  const [elongation, setElongation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    const userId = cookies.userId;
    const searchData = {
      tensileStrength,
      yieldStrength,
      hardness,
      elongation,
      userId
    };
    try {
      await fetch('http://127.0.0.1:5001/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchData)
      });
      
      const response = await fetch('http://localhost:8080/NomAlearn/sendSearchData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchData)
      });

      const results = await response.json();
      console.log('검색 결과 :', results);

      if (results) {
        results[0] = { ...results[0], new: 'kw' };
        setStart(results);
        onResults(results);
        setInfoData({
          tensileStrength,
          yieldStrength,
          hardness,
          elongation
        });
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setIsLoading(false);
    }
  }, [cookies.userId, tensileStrength, yieldStrength, hardness, elongation, setStart, onResults, setInfoData]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        handleSearch();
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleSearch]);

  return (
    <div className="input-text-group">
      <input
        className="form-field"
        name='tensileStrength'
        type="text"
        placeholder="인장 강도"
        value={tensileStrength}
        onChange={(e) => setTensileStrength(e.target.value)}
        disabled={isLoading}
      />
      <input
        className="form-field"
        type="text"
        name='yieldStrength'
        placeholder="항복 강도"
        value={yieldStrength}
        onChange={(e) => setYieldStrength(e.target.value)}
        disabled={isLoading}
      />
      <input
        className="form-field"
        type="text"
        name='hardness'
        placeholder="경도"
        value={hardness}
        onChange={(e) => setHardness(e.target.value)}
        disabled={isLoading}
      />
      <input
        className="form-field"
        type="text"
        name='elongation'
        placeholder="연신율"
        value={elongation}
        onChange={(e) => setElongation(e.target.value)}
        disabled={isLoading}
      />
      {!isLoading && (
        <button className="input-button" onClick={handleSearch} disabled={isLoading}>
          입력
        </button>
      )}
      {isLoading && (
        <div className="loader-container">
          <RotatingSquare
            height="36"
            width="36"
            color="#151515"
          />
          <span className="loading-text">검색 중..</span>
        </div>
      )}
    </div>
  );
};

export default SearchSub;

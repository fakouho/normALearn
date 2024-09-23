import React, { useState, useEffect } from 'react';
import './Search.css';
import '../fonts.css';
import SearchInfo from './SearchInfo';
import Chart from './Chart';
import Table from './Table';
import SearchSub from './searchsub';

function Search({ 
  onStartChange, 
  selectedItem, 
  setSelectedItem, 
  start, 
  setStart
}) {
  const [infoData, setInfoData] = useState(null);

  useEffect(() => {
  }, [selectedItem]);

  useEffect(() => {
    onStartChange(start);
  }, [start, onStartChange]);

  useEffect(() => {
  }, [infoData]);

  const handleResults = (results) => {
    setStart(results);
    setSelectedItem(results[0]);
  };

  return (
    <div className="Search">
      <div className="checkbox-table">
        <h1>검색 페이지</h1>
        <SearchSub 
          onResults={handleResults} 
          setStart={setStart} 
          setInfoData={setInfoData} 
        />
      </div>
      <SearchInfo infoData={infoData} />
      <Chart vsData={selectedItem} />
      <Table setSelectedItem={setSelectedItem} start={start} selectedItem={selectedItem} />
    </div>
  );
}

export default Search;

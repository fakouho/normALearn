import React, { useEffect, useState } from 'react';
import StarIcon from './StarIcon';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title
);

const centerTextPlugin = {
  id: 'centerTextPlugin',
  beforeDraw: function (chart) {
    const ctx = chart.ctx;

    const centerX = chart.chartArea.left + (chart.chartArea.right - chart.chartArea.left) / 2;
    const centerY = chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 2;

    ctx.save();
    ctx.font = '20px Arial';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    const text = chart.config.data.datasets[0].alValue || '준범팀';
    ctx.fillText(text, centerX, centerY);
    ctx.restore();
  }
};

const DoughnutChart = ({ data }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: '# of Votes',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
        alValue: '',
      },
    ],
  });

  const [isChecked, setIsChecked] = useState(false);

  const postData = async (url, data) => {   
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error(`Failed to submit data to ${url}`);
      }
    } catch (error) {
      console.error(`Error submitting data to ${url}:`, error);
    }
  };

  const chartbookmark = (event) => {
    event.stopPropagation(); // 이벤트 전파 중지

    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);

    const outputIdxValue = data?.outputIdx;
    const myPageValue = data?.myPage;

    if (outputIdxValue !== undefined) {
      const updatedData = { outputIdx: outputIdxValue, work: 'ChangeMypage', myPage : myPageValue };     
      postData('http://localhost:8080/NomAlearn/sendListResult', updatedData);
    } else {
      console.warn('Key 값이 정의되어 있지 않습니다. 데이터 전송을 건너뜁니다.');
    }
  };

  useEffect(() => {
    if (data?.mypage && Object.values(data.mypage).some(value => value === 'Y')) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }

    const keys = ['si', 'cu', 'sc', 'fe', 'mn', 'mg', 'zr', 'sm', 'zn', 'ti', 'sr', 'ni', 'ce'];
    const alValue = data?.['al'] ?? '-'; 
    const labels = [];
    const datasetData = [];

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (data && data[key] !== null && data[key] !== 0) {
        labels.push(key);
        datasetData.push(data[key]);
      } else {
        labels.push(key);
        datasetData.push(Math.floor(Math.random() * 100) + 1); 
      }
    }

    setChartData({
      labels,
      datasets: [
        {
          label: labels,
          data: datasetData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
          alValue,
        },
      ],
    });
  }, [data]);

  const renderObjectInfo = () => {
    const defaultInfo = {
      elongationResult: '-',
      hardnessResult: '-',
      tensileStrengthResult: '-',
      yieldStrengthResult: '-',
      firstTemperature: '-',
      firstTime: '-',
      secondTemperature: '-',
      secondTime: '-',
      agingTemperature: '-',
      agingTime: ''
    };

    const infoData = data || defaultInfo;

    const keysToShow = [
      { key: 'tensileStrengthResult', name: '인장강도' },
      { key: 'yieldStrengthResult', name: '항복강도' },
      { key: 'hardnessResult', name: '경도' },
      { key: 'elongationResult', name: '연신율' },     
      { key: 'firstTemperature', name: '1차 용체화온도' },
      { key: 'firstTime', name: '1차 용체화 시간' },
      { key: 'secondTemperature', name: '2차 용체화온도' },
      { key: 'secondTime', name: '2차 용체화 시간' },
      { key: 'agingTemperature', name: '시효온도' },
      { key: 'agingTime', name: '시효시간' }
    ];

    const infoItems = keysToShow.map(({ key, name }, index) => (
      <div key={index}>
        {name}: {infoData[key] !== undefined ? infoData[key] : '데이터 없음'}
      </div>
    ));

    return <div className="data-info">{infoItems}</div>;
  };

  return (
    <div className="chart-area">
      <div className="chart-result">
        <Doughnut data={chartData} plugins={[centerTextPlugin]} />
      </div>
      <div className="chart-result">
        {renderObjectInfo()}
      </div>
      <div className="checkbox-container" onClick={chartbookmark} style={{ cursor: 'pointer' }}>
        {}
        <StarIcon
          checked={isChecked} 
        />
        북마크
      </div>
    </div>
  );
};

export default DoughnutChart;

import React, { useEffect, useState } from 'react';
import './InputModal.css';
import './Chart.css';
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
  beforeDraw: function(chart) {
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

const InputModal = ({ show, onClose, data }) => {
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

  useEffect(() => {
    if (data) {
      const keys = ['si', 'cu', 'sc', 'fe', 'mn', 'mg', 'zr', 'sm', 'zn', 'ti', 'sr', 'ni', 'ce'];
      const alValue = data['al'];
      const labels = [];
      const datasetData = [];

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (data[key] !== null && data[key] !== 0) {
          labels.push(key);
          datasetData.push(data[key]);
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
    }
  }, [data]);

  const renderObjectInfo = () => {
    const defaultInfo = {
      tensileStrengthResult: '-',
      yieldStrengthResult: '-',
      hardnessResult: '-',
      elongationResult: '-',
      firstTemperature: '-',
      firstTime: '-',
      secondTemperature: '-',
      secondTime: '-',
      agingTemperature: '-',
      agingTime: '-'
    };

    const infoData = data || defaultInfo;

    const keysToShow1 = [
      { key: 'tensileStrengthResult', name: '인장강도' },
      { key: 'yieldStrengthResult', name: '항복강도' },
      { key: 'hardnessResult', name: '경도' },
      { key: 'elongationResult', name: '연신율' }
    ];

    const keysToShow2 = [
      { key: 'firstTemperature', name: '1차 용체화온도' },
      { key: 'firstTime', name: '1차 용체화 시간' },
      { key: 'secondTemperature', name: '2차 용체화온도' },
      { key: 'secondTime', name: '2차 용체화 시간' },
      { key: 'agingTemperature', name: '시효온도' },
      { key: 'agingTime', name: '시효시간' }
    ];

    return (
      <div>
        <table className="input-modal-chart-result">
          <thead>
            <tr>
              {keysToShow1.map((item, index) => (
                <th key={`header1-${index}`}>{item.name}</th>
              ))}
            </tr>
            <tr>
              {keysToShow1.map((item, index) => (
                <td key={`data1-${index}`}>{infoData[item.key] !== undefined ? infoData[item.key] : '데이터 없음'}</td>
              ))}
            </tr>
          </thead>
        </table>
        <table className="input-modal-chart-result">
          <thead>
            <tr>
              {keysToShow2.map((item, index) => (
                <th key={`header2-${index}`}>{item.name}</th>
              ))}
            </tr>
            <tr>
              {keysToShow2.map((item, index) => (
                <td key={`data2-${index}`}>{infoData[item.key] !== undefined ? infoData[item.key] : '데이터 없음'}</td>
              ))}
            </tr>
          </thead>
        </table>
      </div>
    );
  };

  if (!show) {
    return null;
  }

  return (
    <div className="input-modal-overlay">
      <div className="input-modal-content">
        <h2>상세 정보</h2>
        <div className="input-modal-chart-container">
          <Doughnut data={chartData} plugins={[centerTextPlugin]} />
        </div>
        <div className="input-modal-result">
          {renderObjectInfo()}
        </div>
        <button className="btn btn-secondary" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default InputModal;

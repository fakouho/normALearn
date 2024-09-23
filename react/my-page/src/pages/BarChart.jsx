import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

const BarChart = ({ data }) => {
  const [mollData, setMollData] = useState([]);
  const [selectedKey, setSelectedKey] = useState('');
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const keys = ['tensileStrengthResult', 'yieldStrengthResult', 'hardnessResult', 'elongationResult'];
  const keyLabels = {
    tensileStrengthResult: '인장강도',
    yieldStrengthResult: '항복강도',
    hardnessResult: '경도',
    elongationResult: '연신율',
  };

  const colors = [
    'rgba(75, 192, 192, 0.6)',
    'rgba(255, 99, 132, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(255, 206, 86, 0.6)',
    'rgba(153, 102, 255, 0.6)',
  ];

  const borderColors = [
    'rgba(75, 192, 192, 1)',
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(153, 102, 255, 1)',
  ];

  useEffect(() => {
    if (data) {
      setMollData((prevData) => {
        let newData;

        if (data.new) {
          newData = [data];
        } else {
          newData = [...prevData, data];
          if (newData.length > 5) {
            newData = newData.slice(0, 1).concat(newData.slice(-4));
          }
        }

        return newData;
      });
    }
  }, [data]);

  useEffect(() => {
    if (selectedKey) {
      const labels = mollData.map((item) => item[selectedKey]?.toString() || `No ${selectedKey}`);
      const dataset = {
        label: keyLabels[selectedKey],
        data: mollData.map(entry => entry[selectedKey] || 0),
        backgroundColor: mollData.map((_, index) => colors[index % colors.length]),
        borderColor: mollData.map((_, index) => borderColors[index % borderColors.length]),
        borderWidth: 1,
      };

      setChartData({
        labels,
        datasets: [dataset],
      });
    }
  }, [mollData, selectedKey]);

  useEffect(() => {
    if (mollData.length >= 0 && mollData.length <= 2) {
      const tensileStrengthButton = document.querySelector('.btn-tensileStrengthResult');
      if (tensileStrengthButton) {
        tensileStrengthButton.click();
      }
    }
  }, [mollData]);

  const handleButtonClick = (key) => {
    setSelectedKey(key);
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          boxWidth: 0,
          font: {
            size: 15,
            weight: 'bold',
          },
        },
      },
      title: {
        display: true,
        text: '비교차트',
        font: {
          size: 20,
          weight: 'bold',
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '데이터 비교',
          font: {
            size: 15,
            weight: 'bold',
          },
        },
        ticks: {
          font: {
            size: 15,
            weight: 'bold',
          },
        },
      },
      y: {
        title: {
          display: true,
          font: {
            size: 15,
            weight: 'bold',
          },
        },
        beginAtZero: true,
        ticks: {
          stepSize: 10,
          font: {
            size: 15,
            weight: 'bold',
          },
        },
      },
    },
  };

  return (
    <div className="chart-area">
      <div className="chart-result">
        <Bar data={chartData} options={options} />
      </div>
      
      <div className="canvas">
        <button className="btn-tensileStrengthResult" onClick={() => handleButtonClick('tensileStrengthResult')}>
          인장강도
        </button>
        <button onClick={() => handleButtonClick('yieldStrengthResult')}>항복강도</button>
        <button onClick={() => handleButtonClick('hardnessResult')}>경도</button>
        <button onClick={() => handleButtonClick('elongationResult')}>연신율</button>
      </div>
    </div>
  );
};

export default BarChart;

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Chart.css';
import DoughnutChart from './DoughnutChart';
import BarChart from './BarChart';

const Chart = ({ vsData }) => {
  return (
    <div className="chart-wrap">
      <div className="chart-row">
        <div className='chart-area'>
          <div className='chart-result'>
            <DoughnutChart data={vsData} /> {}
          </div>
          <div className='chart-result'>
            <BarChart data={vsData}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chart;

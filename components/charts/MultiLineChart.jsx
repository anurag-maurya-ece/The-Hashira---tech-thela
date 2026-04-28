import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const MultiLineChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartLabels = ['Rohini', 'Shahbad Dairy', 'Netaji Subhash Place', 'Sant Nagar', 'Paschim Vihar'];
    const chartDatasets = [
      {
        label: 'Actual Sale',
        data: [2, 4, 5, 2, 4, 7],
        fill: false,
        borderColor: 'red'
      },
      {
        label: 'Potential Sales',
        data: [4, 5, 6, 5, 6, 9],
        fill: false,
        borderColor: 'green'
      }
    ];

    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: chartLabels,
          datasets: chartDatasets
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }, []);

  return <canvas ref={chartRef}></canvas>;
};

export default MultiLineChart;

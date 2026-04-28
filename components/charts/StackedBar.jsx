import React from 'react'
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { useState } from 'react';
import {GoGraph} from 'react-icons/go'

const StackedBar = () => {

    const [chartData, setChartData] = useState({
        // type: 'bar',
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'Piyush Verma',
            data: [12, 2, 3, 4, 6, 7, 8],
            backgroundColor: '#57CC78',
          },
          {
            label: 'Sudheer',
            data: [12, 2, 3, 2, 6, 1, 8],
            backgroundColor: '#55DBDB',
          },
          {
            label: 'Sachin',
            data: [12, 4, 3, 4, 6, 7, 8],
            backgroundColor: '#E2FF32',
          },
          {
            label: 'Bunty Mishra',
            data: [12, 2, 3, 4, 6, 7, 7],
            backgroundColor: '#FEC102',
          },
        ],
      });

      const options = {
        scales: {
          y: {
            stacked: true,
          },
          x: {
            stacked: true,
          },
        },
      };

    //   const config = {
    //     type: 'bar',
    //     data: data,
    //     options: {
    //       plugins: {
    //         title: {
    //           display: true,
    //           text: 'Chart.js Bar Chart - Stacked'
    //         },
    //       },
    //       responsive: true,
    //       scales: {
    //         x: {
    //           stacked: true,
    //         },
    //         y: {
    //           stacked: true
    //         }
    //       }
    //     }
    //   };

      
      return (
        <div className="bg-white p-2 px-14 my-2 rounded-lg w-[640px] mx-auto">
        <div className="flex justify-between">
        <h1
        className="font-[700] text-[24px]"
        >Your Monthly Sales</h1>
        <div className="rounded-md bg-[#F4F7FE] p-1">
        <GoGraph
            fontSize={25}
            className="m-auto my-auto text-[#18FF59]"
        />
        </div>
        </div>
          <Bar data={chartData} options={options} />
        </div>
      );
}

export default StackedBar
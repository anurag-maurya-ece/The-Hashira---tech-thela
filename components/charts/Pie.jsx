import { Pie , Doughnut } from 'react-chartjs-2';
import {Chart, ArcElement} from 'chart.js'
Chart.register(ArcElement);




const PieChart = ({piedata, piedataTitle}) => {

    const data = {
        
        datasets: [
          {
            // label: '# of Votes',
            data: [22, 16, 27, 35],
            backgroundColor: ['#57CC78', '#55DBDB', '#E2FF32', '#FEC102'],
            borderWidth: 1,
          },
        ],
      };
    
      const options = {
        responsive: true,
        plugins: {
   
         
        },
      };


  return (
    <div className="w-[333px] h-fit p-2 bg-white rounded-lg my-2">
    <h1 className="text-[22px] font-[600] text-center">Total Sales Breakdown</h1>
    <div
    className="w-[180px] h-[170px] mx-auto"
    >
    <Doughnut 
    
    data={data} options={options} />
    </div>

    <div className="mx-[70px]">
    <div className="text-[12px] font-[500]">
      <div className="flex justify-between my-1">
        <div className="flex">
        <div className="w-[15px] h-[15px] my-auto mx-1 rounded-full bg-[#57CC78]">
        </div>
        <div>
        Piyush Verma
        </div>
        </div>

        <div className="font-[600]">
        22%
        </div>
      </div>


      <div className="flex justify-between my-1">
        <div className="flex">
        <div className="w-[15px] h-[15px] my-auto mx-1 rounded-full bg-[#55DBDB]">
        </div>
        <div>
        Sudheer
        </div>
        </div>

        <div className="font-[600]">
        16 %
        </div>
      </div>


      <div className="flex justify-between my-1">
        <div className="flex">
        <div className="w-[15px] h-[15px] my-auto mx-1 rounded-full bg-[#E2FF32]">
        </div>
        <div>
        Bunty
        </div>
        </div>

        <div className="font-[600]">
        27 %
        </div>
      </div>


      <div className="flex justify-between my-1">
        <div className="flex">
        <div className="w-[15px] h-[15px] my-auto mx-1 rounded-full bg-[#FEC102]">
        </div>
        <div>
        Sachin
        </div>
        </div>

        <div className="font-[600]">
        35 %
        </div>
      </div>
      </div>
    </div>
    </div>
  
  )
};

export default PieChart;


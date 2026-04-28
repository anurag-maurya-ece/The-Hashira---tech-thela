import { IoIosNotifications } from 'react-icons/io';
import { RiSecurePaymentFill } from 'react-icons/ri';
import { MdRateReview, MdLeaderboard, MdRadar } from 'react-icons/md';
import { GiImperialCrown, GiBuyCard } from 'react-icons/gi';

type Props = {
  component: Function;
};

export default function Sidebar(props: Props) {
  const component = props.component;

  return (
    <>
      <aside className="w-full md:w-[320px] lg:w-[380px] flex-shrink-0">
        <div className="overflow-y-auto h-full min-h-screen md:h-screen pt-10 px-4 bg-gray-900 border-r-0 md:border-r-4 border-black">
          {/* make sidebar in tailwind with profile */}
          <div className="flex flex-col items-center justify-between space-y-3">
            <div className="flex-shrink-0">
              <img
                className="h-[120px] w-[120px] rounded-full border-3 border-solid border-green-500"
                src="http://medicine.exeter.ac.uk/images/profiles/John_Dennis.jpg"
                alt="John"
              />
            </div>
            <div className="text-green-500 p-2 rounded-lg bg-purple-50 border-green-500 flex">
              <GiImperialCrown className="mx-2" fontSize={25} />
              <div className="mx-2 text-green-500">Premium</div>
            </div>
            {/* basic info + qr */}
            <div className="flex flex-col space-y-3 justify-between text-gray-900 items-center">
              <h2 className="text-3xl text-white font-extrabold">Mr. Oberoi</h2>
              <p className="text-xl text-white">Customer ID: 007</p>
              <button
                onClick={() => {
                  component('review');
                }}
                className="rounded-lg p-2 flex w-full my-4 bg-white hover:bg-green-300"
              >
                <MdRateReview className="text-green-500" fontSize={25} />
                <div> Review Your Vendors</div>
              </button>

              <button
                onClick={() => {
                  component('leaderboard');
                }}
                className="flex w-full rounded-lg p-2 my-4 bg-white hover:bg-green-300"
              >
                <MdLeaderboard className="text-green-500" fontSize={25} />
                <div> My Leaderboard</div>
              </button>
              <button
                onClick={() => {
                  component('vendors near me');
                }}
                className="flex w-full rounded-lg p-2 my-4 bg-white hover:bg-green-300"
              >
                <GiBuyCard className="text-green-500" fontSize={25} />
                <div> Vendors near me</div>
              </button>

              <button
                onClick={() => {
                  component('demand ping');
                }}
                className="flex w-full rounded-lg p-2 my-4 bg-white hover:bg-blue-300 border-2 border-blue-500 shadow-lg shadow-blue-500/20"
              >
                <MdRadar className="text-blue-500 animate-pulse" fontSize={25} />
                <div className="font-bold text-blue-600 ml-2"> Demand Ping (Beta)</div>
              </button>
              {/* make a button */}
            </div>
            {/* button options */}
            {/* make div with borders and text on left and button on right */}
            <div className="flex flex-col w-full px-2 space-y-1 justify-between items-center"></div>
          </div>
        </div>
      </aside>
    </>
  );
}

import React from "react";
import { testimonialCarouselData } from "../utilities/data";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper";

const renderStudentFeedbackCarouselSlides = testimonialCarouselData.map(
  (data, index) => (
    <SwiperSlide
      key={index}
      className="h-full bg-purple-50 rounded-3xl px-6 py-8  flex flex-col gap-8"
    >
      <div className="flex flex-col items-center justify-between  rounded-3xl xl:h-full w-full gap-4">
        <div className="flex w-full justify-between items-center">
          <div className="flex gap-4 items-center">
            <Image
              src={`/reviews/${data.image}.svg`}
              alt="mentor"
              width={56}
              height={56}
              className="h-14 rounded-full"
            />
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-[#1B1D1F]">{data.name}</h1>
              <p className="text-gray-500">{data.designation}</p>
            </div>
          </div>
          <div>
            <img src={`/reviews/quoteLogo.svg`} alt=""  className="text-green-500"/>
          </div>
        </div>
      </div>
      <div className="text-[#363A3D]">{data.comment}</div>
    </SwiperSlide>
  )
);

type Props = {};

const ReviewCarousel = (props: Props) => {
  return (
    <div className="pb-10 w-full">
      <>
        <Swiper
          spaceBetween={15}
          slidesPerView={1}
          centeredSlides={true}
          pagination={{
            clickable: true,
            el: ".swiper-pagination-student",
          }}
          loop={true}
          navigation={{
            prevEl: ".swiper-button-student-prev",
            nextEl: ".swiper-button-student-next",
          }}
          modules={[Navigation, Pagination]}
          breakpoints={{
            480: {
              slidesPerView: 1,
              spaceBetween: 15,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1440: {
              slidesPerView: 3,
              spaceBetween: 25,
            },
          }}
          className="xl:h-full gap-2 w-full"
        >
          {renderStudentFeedbackCarouselSlides}
        </Swiper>
        <div className="swiper-button-student-prev flex items-center justify-center font-bold text cursor-pointer h-8 w-8 sm:h-9 sm:w-9 rounded-full absolute bg-green-500 hover:bg-green-600 z-10 transition-colors top-1/2 -translate-y-1/2 -left-4 sm:-left-8 md:-left-12">
          {"<"}
        </div>
        <div className="swiper-button-student-next flex items-center justify-center font-bold text cursor-pointer h-8 w-8 sm:h-9 sm:w-9 rounded-full absolute bg-green-500 hover:bg-green-600 z-10 transition-colors top-1/2 -translate-y-1/2 -right-4 sm:-right-8 md:-right-12">
          {">"}
        </div>
        {/* <div className="swiper-pagination-student absolute cursor-pointer  text-green-500 text-center flex gap-2 pt-8 px-4 md:px-0  md:left-[46%]   md:pt-6 md:gap-4"></div> */}
      </>
    </div>
  );
};

export default ReviewCarousel;

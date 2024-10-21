import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

import "./styles.css";

export default function App() {
  return (
    <>
      <Swiper className="mySwiper">
        <SwiperSlide>
            <img src={'https://vietlifetravel.com.vn/wp-content/uploads/2019/11/banner-web-euro-circle.jpg'} alt="logo"/>
        </SwiperSlide>
        <SwiperSlide>
            <img src={'https://vionatravel.com/upload/files/chung/banner_5.jpg'} alt="logo"/>
        </SwiperSlide>
        <SwiperSlide>
            <img src={'https://vietlifetravel.com.vn/wp-content/uploads/2019/11/banner-web-euro-circle.jpg'} alt="logo"/>
        </SwiperSlide>
        <SwiperSlide>
            <img src={'https://vietlifetravel.com.vn/wp-content/uploads/2019/11/banner-web-euro-circle.jpg'} alt="logo"/>
        </SwiperSlide>
      </Swiper>
    </>
  );
}


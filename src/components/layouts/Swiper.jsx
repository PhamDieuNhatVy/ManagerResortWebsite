import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

import "./styles.css";

export default function App() {
  return (
    <>
      <Swiper className="mySwiper">
        <SwiperSlide>
            <img src={'https://hoangkhoitravel.com/img_data/images/tour-mien-tay-2-ngay-1-dem-khoi-hanh-tu-ho-chi-minh.jpg'} alt="logo"/>
        </SwiperSlide>
        <SwiperSlide>
            <img src={'https://static.vinwonders.com/production/khu-du-lich-sinh-thai-lai-thieu-top-banner_optimized.jpg'} alt="logo"/>
        </SwiperSlide>
        <SwiperSlide>
            <img src={'https://static.vinwonders.com/production/khu-du-lich-sinh-thai-o-tphcm-banner.jpg'} alt="logo"/>
        </SwiperSlide>
        <SwiperSlide>
            <img src={'https://phuocthinhgroup.vn/wp-content/uploads/2024/04/homestay-la-gi-banner.jpg'} alt="logo"/>
        </SwiperSlide>
      </Swiper>
    </>
  );
}


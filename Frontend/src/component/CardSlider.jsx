import React from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CardSlider = ({ title, data }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 2,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 2 },
      },
    ],
  };

  return (
    <div className="px-10 my-8">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <Slider {...settings}>
        {data.map((item, index) => (
          <motion.div
            key={index}
            className="px-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
          >
            <div className="relative bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-48 object-cover"
              />

              {/* Motion Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="mb-3 px-4 py-2 bg-white text-black text-sm font-semibold rounded hover:bg-gray-200 transition"
                >
                  ▶ Play
                </motion.button>

                <motion.button
                  href="/lobby"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded hover:bg-red-500 transition"
                >
                  
                  + Create Room
                </motion.button>
              </motion.div>

              <div className="p-2 text-center">
                <p className="text-sm font-medium">{item.title}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </Slider>
    </div>
  );
};

export default CardSlider;

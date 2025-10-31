import React from "react";
import CardSlider from "./CardSlider";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const heroVideos = [
    {
      title: "Ek Deewane ki Deewaniyat",
      description: "A soulful tale of love, longing and the little moments that make us feel alive.",
      src: "https://res.cloudinary.com/dzfftyy42/video/upload/v1761805396/herovideo_i4d3qe.mp4",
    },
    {
      title: "The Last Melody",
      description: "A musician’s journey to find his true rhythm amidst chaos.",
      src: "https://res.cloudinary.com/dzfftyy42/video/upload/v1761804456/herovideo2_gghgk9.mp4",
    },
    {
      title: "Beyond the Horizon",
      description: "An adventure that challenges the boundaries of love and destiny.",
      src: "/public/herovideo3.mp4",
    },
  ];

  const trendingMovies = [
    { title: "Half CA", img: "https://static.toiimg.com/photo/110452330/110452330.jpg" },
    { title: "Half CA", img: "https://static.toiimg.com/photo/110452330/110452330.jpg" },
    { title: "Half CA", img: "https://static.toiimg.com/photo/110452330/110452330.jpg" },
    { title: "Half CA", img: "https://static.toiimg.com/photo/110452330/110452330.jpg" },
    { title: "Half CA", img: "https://static.toiimg.com/photo/110452330/110452330.jpg" },
    { title: "Half CA", img: "https://static.toiimg.com/photo/110452330/110452330.jpg" },
    { title: "Half CA", img: "https://static.toiimg.com/photo/110452330/110452330.jpg" },
    { title: "Half CA", img: "https://static.toiimg.com/photo/110452330/110452330.jpg" },

  ];

  const newReleases = [
    { title: "Dark Notes", img: "/src/assets/movie6.jpg" },
    { title: "Echoes of You", img: "/src/assets/movie7.jpg" },
    { title: "Fading Stars", img: "/src/assets/movie8.jpg" },
    { title: "Parallel Hearts", img: "/src/assets/movie9.jpg" },
    { title: "Whisper", img: "/src/assets/movie10.jpg" },
  ];

  return (
    <div className="bg-[#141414] text-white">
      {/* HERO SECTION */}
      <Slider
        dots={true}
        fade={true}
        infinite={true}
        speed={800}
        slidesToShow={1}
        slidesToScroll={1}
        autoplay={true}
        autoplaySpeed={6000}
        arrows={false}
        pauseOnHover={false}
      >
        {heroVideos.map((video, index) => (
          <div key={index} className="relative w-full h-[85vh] overflow-hidden">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              src={video.src}
              type="video/mp4"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
            <div className="relative z-10 max-w-3xl px-10 top-1/3">
              <h1 className="text-5xl font-bold mb-4">{video.title}</h1>
              <p className="text-lg text-gray-200 mb-6">{video.description}</p>
              <div className="flex gap-4">
                <button className="px-6 py-2 bg-white text-black font-semibold rounded hover:bg-gray-200 transition">
                  ▶ Watch Now
                </button>
                <button className="px-6 py-2 bg-gray-600 bg-opacity-70 text-white rounded hover:bg-gray-500 transition">
                  ℹ More Info
                </button>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {/* CARDS SECTION */}
      <CardSlider title="Trending Now" data={trendingMovies} />
      <CardSlider title="New Releases" data={newReleases} />
    </div>
  );
};

export default Home;

import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import cover1 from "../assets/cover1.png";
import cover2 from "../assets/cover2.png";

const Banner = () => {
  const cover = [
    {
      id: 1,
      photo: cover1,
    },

    {
      id: 2,
      photo: cover2,
    },

  ];
  return (
    <div className="banner">
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        interval={3000}
        dynamicHeight
      >
        {cover.map((cover) => (
          <div>
            <img src={cover.photo} alt="" />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Banner;

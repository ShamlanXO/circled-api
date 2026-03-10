import PropTypes from "prop-types";
import Slider from "react-slick";
import { useState, useRef, useEffect } from "react";
// @mui
import { useTheme } from "@mui/material/styles";
import { Box, Card } from "@mui/material";
// _mock_
import { _carouselsExample } from "../../../../_mock";
// components
import Image from "../../../../components/Image";
import { CarouselArrowIndex } from "../../../../components/carousel";
import axios from "axios";
import { useLocation, useNavigate } from "react-router";
// ----------------------------------------------------------------------

export default function CarouselBasic1({ media }) {
  const theme = useTheme();
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(
    theme.direction === "rtl" ? _carouselsExample.length - 1 : 0
  );

  const settings = {
    slidesToShow: 2,
    infinite: false,
    dots: false,
    arrows: false,
    autoplay: false,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === "rtl"),
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 2.2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 2.2 },
      },
      {
        breakpoint: 359,
        settings: { slidesToShow: 1.7 },
      },
    ],
  };

  // const settings = {
  //   slidesToShow: 3,
  //   centerMode: true,
  //   centerPadding: '60px',
  //   rtl: Boolean(theme.direction === 'rtl'),
  //   responsive: [
  //     {
  //       breakpoint: 1024,
  //       settings: { slidesToShow: 2 },
  //     },
  //     {
  //       breakpoint: 600,
  //       settings: { slidesToShow: 2 },
  //     },
  //     {
  //       breakpoint: 480,
  //       settings: { slidesToShow: 1, centerPadding: '0' },
  //     },
  //   ],
  // };

  const handlePrevious = () => {
    carouselRef.current?.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current?.slickNext();
  };

  return (
    <Box>
      <Slider ref={carouselRef} {...settings}>
        {media.map((item) => (
          <CarouselItem link={item} key={item.id} item={item} />
        ))}
      </Slider>

      {/* <CarouselArrowIndex
        index={currentIndex}
        total={_carouselsExample.length}
        onNext={handleNext}
        onPrevious={handlePrevious}
      /> */}
    </Box>
  );
}

// ----------------------------------------------------------------------

CarouselItem.propTypes = {
  item: PropTypes.shape({
    image: PropTypes.string,
    title: PropTypes.string,
  }),
};

function CarouselItem({ item, link }) {
  const { image, title } = item;

  return (
    <VideoImage
      alt={title}
      src={image}
      link={link}
      // ratio="1/1"
      sx={{ height: "173px", borderRadius: "8px", marginRight: "12px" }}
    />
  );
}

const VideoImage = (props) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [url, setUrl] = useState("");
  useEffect(() => {
    axios
      .get(
        `https://vimeo.com/api/oembed.json?url=https://player.vimeo.com/video/${
          props?.link?.split("https://vimeo.com/")[1]
        }`
      )
      .then((res) => {
        setUrl(
          props.withPlay
            ? res.data.thumbnail_url_with_play_button
            : res.data.thumbnail_url
        );
      });
  }, [props.link]);

  return (
    <Image
      onClick={() =>
        navigate("/client/myWorkoutCalendar/workoutDay/exerciseView", {
          state: { ...state },
        })
      }
      src={url || "/images/instructor/exerciseImage.png"}
      // ratio="1/1"
      sx={{ height: "173px", borderRadius: "8px", marginRight: "12px" }}
    />
  );
};

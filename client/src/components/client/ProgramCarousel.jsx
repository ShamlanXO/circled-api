import React, { useRef, useEffect } from "react";
import Slider from "react-slick";
import { connect } from "react-redux";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function DailyExercise(props) {
  const inputEl = useRef(null);
  useEffect(() => {
    if (inputEl.current) inputEl.current.slickGoTo(props.currentDay);
  }, [props.current,props.currentDay]);

  const settings = {
    className: "center",
    centerMode: true,
    infinite: false,
    centerPadding: "20px",
    slidesToShow: 1,
    infinite: false,
    initialSlide: props.current,
    speed: 500,
    arrows: false,
  };

  const onNext = () => {
    inputEl.current.slickNext();
  };

  const onPrev = () => {
    inputEl.current.slickPrev();
  };

  return (
    <Slider {...settings} ref={inputEl}>
      {props.items.map((item, index) => {
        return (
          <div {...props} onNext={onNext} onPrev={onPrev}>
            {item}
          </div>
        );
      })}
    </Slider>
  );
}

const mapStateToProps = (state) => {
  return {
    current: state.AtheletePlan.currentDay,
  };
};

export default connect(mapStateToProps, {})(DailyExercise);

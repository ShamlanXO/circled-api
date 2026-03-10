import PropTypes from 'prop-types';
import Slider from 'react-slick';
import { useState, useRef } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Card, Typography, CardContent } from '@mui/material';
// _mock_
import { _carouselsExample } from '../../../../_mock';
// components
import Image from '../../../../components/Image';
import { CarouselArrowIndex } from '../../../../components/carousel';
import LightboxModal from '../../../../components/LightboxModal';

// ----------------------------------------------------------------------

export default function CarouselBasic2({items}) {
  const theme = useTheme();
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
const [openLightbox, setOpenLightbox] = useState(false);
const [selectedImage, setSelectedImage] = useState(0);
  const settings = {
    dots: false,
    arrows: false,
    autoplay: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: currentIndex,
    fade: Boolean(theme.direction !== 'rtl'),
    rtl: Boolean(theme.direction === 'rtl'),
    beforeChange: (current, next) => setCurrentIndex(next),
  };

  const handlePrevious = () => {
    carouselRef.current?.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current?.slickNext();
  };

  const setImageLight=(index)=>{
    setSelectedImage(carouselRef.current.props.initialSlide);
    setOpenLightbox(true)
  }

  return (
    <Card>
      <Slider ref={carouselRef} {...settings}>
        {items.map((item,ind) =>{ return(
          <CarouselItem key={ind} item={item} index={ind} onClick={setImageLight} />
        )})}
      </Slider>

      <CarouselArrowIndex
        index={currentIndex}
        total={items.length}
        onNext={handleNext}
        onPrevious={handlePrevious}
        sx={{ bottom: 24 }}
      />
     
     <LightboxModal
        images={items}
        mainSrc={items[selectedImage]}
        photoIndex={selectedImage}
        setPhotoIndex={setSelectedImage}
        isOpen={openLightbox}
        onCloseRequest={() => setOpenLightbox(false)}
      />
    </Card>
  );
}

// ----------------------------------------------------------------------

CarouselItem.propTypes = {
  item: PropTypes.shape({
    description: PropTypes.string,
    image: PropTypes.string,
    title: PropTypes.string,
  }),
};

function CarouselItem({ item ,onClick,index}) {


  return (
    <>
      <Image ratio={"9/14"} src={item} key={item} onClick={()=>onClick(index)}/>

    </>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPeopleGroup,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import parse from "html-react-parser";
import Main_sidebar from "../sidenav/main_sidebar";
import { useParams } from "react-router-dom";

const EventPastPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(
          `https://mlsa-backend-4w03.onrender.com/api/event/c/${eventId}`
        );
        const eventData = response.data.data[0];
        setEvent({
          name: eventData.eventName,
          image: eventData.image,
          description: eventData.eventInfo,
          attendeeCount: eventData.registeredUser,
          images: eventData.images || [],
        });
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };
    fetchEventDetails();
  }, [eventId]);

  if (!event) {
    return <div>Loading...</div>;
  }

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? event.images.length - 1 : prevIndex - 1
    );
    sliderRef.current.scrollLeft -= sliderRef.current.offsetWidth;
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === event.images.length - 1 ? 0 : prevIndex + 1
    );
    sliderRef.current.scrollLeft += sliderRef.current.offsetWidth;
  };

  const getVisibleImages = () => {
    const visibleCount =
      window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
    const visibleImages = [];

    for (let i = currentIndex; i < currentIndex + visibleCount; i++) {
      const index = i >= event.images.length ? i % event.images.length : i;
      visibleImages.push(event.images[index]);
    }

    return visibleImages;
  };

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <Main_sidebar className="mr-8" />
      <div className="flex-1 p-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-sky-600 text-center mt-6 mb-12">
          {event.name}
        </h1>
        <div className="flex flex-col lg:flex-col items-center justify-center w-full">
          <div
            className="w-[80%] mb-12 ml-52 lg:ml-60 sm:h-[30vh] lg:h-auto"
            style={{ maxWidth: "100%", margin: "0 auto" }}
          >
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="w-full px-4 lg:px-0">
            <h2 className="text-3xl sm:text-3xl md:text-4xl text-center font-bold mb-4 text-sky-600 mt-8">
              Event Description
            </h2>
            <div className="text-white text-lg sm:text-xl sm:ml-2 lg:ml-32 md:text-2xl mb-8 text-center lg:text-left">
              {parse(event.description)}
            </div>
            <div className="flex items-center justify-center lg:justify-center">
              <FontAwesomeIcon
                icon={faPeopleGroup}
                className="mr-2 text-blue-500 text-2xl sm:text-3xl md:text-4xl"
              />
              <span className="text-blue-500 text-xl sm:text-2xl md:text-3xl font-bold">
                {300 + event.attendeeCount}+  Students Registered
              </span>
            </div>
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl text-left font-bold mb-8 text-sky-600 mt-16 ml-4 md:ml-24">
          Event Images
        </h2>
        <div className="relative w-full flex flex-col items-center">
          <div className="flex items-center justify-center mb-4">
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
              onClick={handlePrevClick}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
              onClick={handleNextClick}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
          <div className="overflow-hidden flex justify-center w-full lg:w-3/4">
            <div ref={sliderRef} className="flex flex-no-wrap justify-center w-full">
              {getVisibleImages().map((imageUrl, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 mx-4 w-full max-w-sm md:max-w-md mb-8"
                >
                  <div className="relative w-full h-80 sm:h-80 md:h-96">
                    <img
                      src={imageUrl}
                      alt={`Event ${currentIndex + index}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/400x600?text=Image+Not+Found";
                      }}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPastPage;


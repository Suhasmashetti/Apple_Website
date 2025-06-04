import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);
import { useEffect, useRef, useState, useCallback, useReducer } from "react";

import { hightlightsSlides } from "../constants";
import { pauseImg, playImg, replayImg } from "../utils";

// Constants
const BREAKPOINTS = {
  MOBILE: 760,
  TABLET: 1200,
};

const PROGRESS_WIDTHS = {
  MOBILE: "10vw",
  TABLET: "10vw", 
  DESKTOP: "4vw",
};

// Reducer for video state management
const videoReducer = (state, action) => {
  switch (action.type) {
    case 'VIDEO_END':
      return { ...state, isEnd: true, videoId: action.payload + 1 };
    case 'VIDEO_LAST':
      return { ...state, isLastVideo: true };
    case 'VIDEO_RESET':
      return { ...state, videoId: 0, isLastVideo: false, isEnd: false };
    case 'TOGGLE_PLAY':
      return { ...state, isPlaying: !state.isPlaying };
    case 'START_PLAY':
      return { ...state, startPlay: true, isPlaying: true };
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };
    default:
      return state;
  }
};

const VideoCarousel = () => {
  const videoRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDivRef = useRef([]);

  // Initial video state
  const initialVideoState = {
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  };

  const [video, dispatch] = useReducer(videoReducer, initialVideoState);
  const [loadedData, setLoadedData] = useState([]);
  const [error, setError] = useState(null);
  
  const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video;

  // Get responsive progress width
  const getProgressWidth = useCallback(() => {
    const width = window.innerWidth;
    if (width < BREAKPOINTS.MOBILE) return PROGRESS_WIDTHS.MOBILE;
    if (width < BREAKPOINTS.TABLET) return PROGRESS_WIDTHS.TABLET;
    return PROGRESS_WIDTHS.DESKTOP;
  }, []);

  // GSAP animations with cleanup
  useGSAP(() => {
    const sliderTween = gsap.to("#slider", {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: "power2.inOut",
    });

    const videoTween = gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video",
        toggleActions: "restart none none none",
      },
      onComplete: () => {
        dispatch({ type: 'START_PLAY' });
      },
    });

    // Cleanup function
    return () => {
      sliderTween.kill();
      videoTween.kill();
    };
  }, [isEnd, videoId]);

  // Progress bar animation effect
  useEffect(() => {
    let currentProgress = 0;
    let span = videoSpanRef.current;
    let anim;

    if (span[videoId]) {
      // Animation to move the indicator
      anim = gsap.to(span[videoId], {
        onUpdate: () => {
          // Get the progress of the video
          const progress = Math.ceil(anim.progress() * 100);

          if (progress !== currentProgress) {
            currentProgress = progress;

            // Set the width of the progress bar
            gsap.to(videoDivRef.current[videoId], {
              width: getProgressWidth(),
            });

            // Set the background color of the progress bar
            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: "white",
            });
          }
        },

        // When the video is ended, replace the progress bar with the indicator
        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: "12px",
            });
            gsap.to(span[videoId], {
              backgroundColor: "#afafaf",
            });
          }
        },
      });

      if (videoId === 0) {
        anim.restart();
      }

      // Update the progress bar
      const animUpdate = () => {
        if (videoRef.current[videoId] && hightlightsSlides[videoId]) {
          anim.progress(
            videoRef.current[videoId].currentTime /
              hightlightsSlides[videoId].videoDuration
          );
        }
      };

      if (isPlaying) {
        // Ticker to update the progress bar
        gsap.ticker.add(animUpdate);
      } else {
        // Remove the ticker when the video is paused
        gsap.ticker.remove(animUpdate);
      }

      // Cleanup function
      return () => {
        if (anim) anim.kill();
        gsap.ticker.remove(animUpdate);
      };
    }
  }, [videoId, startPlay, isPlaying, getProgressWidth]);

  // Video play/pause effect
  useEffect(() => {
    if (loadedData.length > 3) {
      try {
        if (!isPlaying) {
          videoRef.current[videoId]?.pause();
        } else {
          if (startPlay && videoRef.current[videoId]) {
            videoRef.current[videoId].play().catch((err) => {
              console.error("Error playing video:", err);
              setError("Failed to play video");
            });
          }
        }
      } catch (err) {
        console.error("Video control error:", err);
        setError("Video control failed");
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  // Handle video process actions
  const handleProcess = useCallback((type, i) => {
    switch (type) {
      case "video-end":
        dispatch({ type: 'VIDEO_END', payload: i });
        break;
      case "video-last":
        dispatch({ type: 'VIDEO_LAST' });
        break;
      case "video-reset":
        dispatch({ type: 'VIDEO_RESET' });
        break;
      case "pause":
      case "play":
        dispatch({ type: 'TOGGLE_PLAY' });
        break;
      default:
        console.warn(`Unknown process type: ${type}`);
    }
  }, []);

  // Handle video metadata loading
  const handleLoadedMetaData = useCallback((i, e) => {
    setLoadedData((prev) => [...prev, e]);
  }, []);

  // Handle video errors
  const handleVideoError = useCallback((i, error) => {
    console.error(`Video ${i} failed to load:`, error);
    setError(`Video ${i + 1} failed to load`);
  }, []);

  // Handle video play event
  const handleVideoPlay = useCallback(() => {
    dispatch({ type: 'SET_PLAYING', payload: true });
  }, []);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <>
      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Video Carousel */}
      <div className="flex items-center">
        {hightlightsSlides.map((list, i) => (
          <div key={list.id} id="slider" className="sm:pr-20 pr-10">
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                <video
                  id="video"
                  playsInline={true}
                  className={`${
                    list.id === 2 && "translate-x-44"
                  } pointer-events-none`}
                  preload="auto"
                  muted
                  ref={(el) => (videoRef.current[i] = el)}
                  onEnded={() =>
                    i !== 3
                      ? handleProcess("video-end", i)
                      : handleProcess("video-last")
                  }
                  onPlay={handleVideoPlay}
                  onLoadedMetadata={(e) => handleLoadedMetaData(i, e)}
                  onError={(e) => handleVideoError(i, e)}
                >
                  <source src={list.video} type="video/mp4" />
                </video>
              </div>

              <div className="absolute top-12 left-[5%] z-10">
                {list.textLists.map((text, textIndex) => (
                  <p key={textIndex} className="md:text-2xl text-xl font-medium">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="relative flex-center mt-10">
        {/* Progress Indicators */}
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {videoRef.current.map((_, i) => (
            <span
              key={i}
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
              ref={(el) => (videoDivRef.current[i] = el)}
              onClick={() => dispatch({ type: 'VIDEO_END', payload: i - 1 })}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && dispatch({ type: 'VIDEO_END', payload: i - 1 })}
              aria-label={`Go to video ${i + 1}`}
            >
              <span
                className="absolute h-full w-full rounded-full"
                ref={(el) => (videoSpanRef.current[i] = el)}
              />
            </span>
          ))}
        </div>

        {/* Play/Pause/Replay Button */}
        <button 
          className="control-btn ml-4"
          onClick={
            isLastVideo
              ? () => handleProcess("video-reset")
              : !isPlaying
              ? () => handleProcess("play")
              : () => handleProcess("pause")
          }
          aria-label={
            isLastVideo 
              ? "Replay videos" 
              : !isPlaying 
              ? "Play video" 
              : "Pause video"
          }
        >
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;
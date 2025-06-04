import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { heroVideo, smallHeroVideo } from "../utils"
import { useEffect, useState } from "react"

const Hero = () => {
  const [videoSrc, setVideoSrc] = useState(() => {
    // Check if window is available (client-side)
    if (typeof window !== 'undefined') {
      return window.innerWidth < 537 ? smallHeroVideo : heroVideo;
    }
    // Default to heroVideo for SSR
    return heroVideo;
  });
  
  const handleVideo = () => {
    if (window.innerWidth < 537) {
      setVideoSrc(smallHeroVideo) 
    } else {
      setVideoSrc(heroVideo)
    }
  }

  useEffect(() => {
    // Set initial video source on mount (handles SSR hydration)
    handleVideo();
    
    window.addEventListener('resize', handleVideo);
    
    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('resize', handleVideo);
    }
  }, [])

  useGSAP(() => {
    gsap.to('#hero', { opacity: 1, delay: 1.1 })
    gsap.to("#cta", { opacity: 1, y: -50, delay: 1 })
  }, [])
  
  return (
    <section className='w-full nav-height bg-black relative'>
      <div className='h-5/6 w-full flex-center flex-col px-4 sm:px-6'>
        <p id='hero' className='hero-title opacity-0 text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl'>iPhone 15 Pro</p>
        <video 
          className="pointer-events-none w-full max-w-4xl mt-4 sm:mt-6 md:mt-8"
          autoPlay 
          muted 
          playsInline={true} 
          key={videoSrc}
        >
          <source src={videoSrc} type="video/mp4"/>
        </video>
      </div>
      <div id="cta" className="flex flex-col items-center opacity-0 translate-y-12 px-4 pb-6 sm:pb-8 md:pb-10">
        <a href="#highlights" className="btn mb-3 sm:mb-4">Buy</a>
        <p className="font-normal text-lg sm:text-xl text-center">From $199/month or $999</p>
      </div>
    </section>
  )
}

export default Hero
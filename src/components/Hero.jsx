import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { heroVideo, smallHeroVideo } from "../utils"
import { useEffect, useRef, useState } from "react"

const Hero = () => {
  const container = useRef()

  const [videoSrc, setVideoSrc] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 537
      ? smallHeroVideo
      : heroVideo
  )

  useEffect(() => {
    const handleVideo = () => {
      setVideoSrc(window.innerWidth < 537 ? smallHeroVideo : heroVideo)
    }

    window.addEventListener('resize', handleVideo)
    return () => window.removeEventListener('resize', handleVideo)
  }, [])

  useGSAP(() => {
    gsap.to(".hero-title", { opacity: 1, delay: 1.1 })
    gsap.to(".cta", { opacity: 1, y: -50, delay: 1 })
  }, { scope: container })

  return (
    <section ref={container} className='w-full nav-height bg-black relative'>
      <div className='h-5/6 w-full flex-center flex-col px-4 sm:px-6'>
        <p className='hero-title opacity-0 text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl'>iPhone 15 Pro</p>
        <video 
          className="pointer-events-none w-full max-w-4xl mt-4 sm:mt-6 md:mt-8"
          autoPlay 
          muted 
          playsInline 
          key={videoSrc}
        >
          <source src={videoSrc} type="video/mp4"/>
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="cta flex flex-col items-center opacity-0 translate-y-12 px-4 pb-6 sm:pb-8 md:pb-10">
        <a href="#highlights" className="btn mb-3 sm:mb-4">Buy</a>
        <p className="font-normal text-lg sm:text-xl text-center text-white">From $199/month or $999</p>
      </div>
    </section>
  )
}

export default Hero

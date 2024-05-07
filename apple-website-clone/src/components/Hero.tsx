import React, {useState, useEffect} from 'react';
import gsap from "gsap";
import { useGSAP } from '@gsap/react';
import { heroVideo, smallHeroVideo } from '../utils';

type Props = {}

const getVideoSrc = (innerWidth : number) => {
  console.log(innerWidth)
  if (innerWidth < 760)
      return smallHeroVideo;
  return heroVideo;
}

function HeroSection({}: Props) {
  const [videoSrc, setVideoSrc] = useState(getVideoSrc(window.innerWidth));

  const handleVideoSrcSet = () => {
    setVideoSrc(getVideoSrc(window.innerWidth));
  }

  useEffect(() => {
    window.addEventListener('resize', handleVideoSrcSet)
  
    return () => {
      window.removeEventListener('resize', handleVideoSrcSet);
    }
  }, [])
  

  useGSAP(() => {
    gsap.to("#hero", {
      opacity : 1,
      delay : 2
    });
    gsap.to("#hero-cta", {
      opacity : 1,
      delay : 2,
      y : -50
    });
  }, []);

  return (
    <section className='w-full nav-height bg-black'>
      <div className='h-5/6 w-full flex-center flex-col'>
        <p id="hero" className='hero-title'>Iphone 15 Pro</p>
        <div className='md:w-10/12 w-9/12'>
          <video className='pointer-events-none' autoPlay muted playsInline={true} key={videoSrc}>
            <source src={videoSrc} type="video/mp4" />
          </video>
        </div>
      </div>
      <div
        id="hero-cta"
        className='flex flex-col items-center opacity-0 translate-y-20'
      >
        <a href="#highlights" className='btn'>
          Buy
        </a>
        <p className='font-normal text-xl'>From $199/month or $999</p>
      </div>
    </section>
  )
}

export default HeroSection;
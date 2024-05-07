import React, { useEffect, useRef, useState } from 'react'
import { hightlightsSlides } from '../constants'
import gsap from 'gsap';

type Props = {}

function VideoCarousel({ }: Props) {
    const videoRef = useRef([]);
    const videoSpanRef = useRef([]);
    const videoDivRef = useRef([]);

    const [video, setVideo] = useState({
        isEnd: false,
        startPlay: false,
        videoId: 0,
        isLastVideo: false,
        isPlaying: false
    });

    const [loadedData, setLoadedData] = useState([]);

    const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video;

    useEffect(() => {
        if (loadedData.length > 3) {
            if (!isPlaying) {
                // @ts-ignore
                videoRef.current[videoId]?.pause();
            } else {
                // @ts-ignore
                startPlay && videoRef.current[videoId].play();
            }
        }
    }, [startPlay, videoId, isPlaying, loadedData])

    useEffect(() => {
        const currentProgress = 0;
        let span = videoSpanRef.current;
        if (span[videoId]) {
            // animate the progress of the video
            let anim = gsap.to(span[videoId], {
                onUpdate: () => {

                },
                onComplete: () => {

                }
            })
        }
    }, [videoId, startPlay])

    return (
        <>
            <div className='flex items-center'>
                {hightlightsSlides.map((list, index) => <>
                    <div
                        key={list.id}
                        id="slider"
                        className='sm:pr-20 pr-10'>
                        <div className='video-carousel_container'>
                            <div className='w-full h-full flex-center rounded-3xl overflow-hidden bg-black'>
                                <video
                                    id="video"
                                    playsInline={true}
                                    preload='auto'
                                    muted
                                    ref={(el => {
                                        // @ts-ignore
                                        videoRef.current[index] = el;
                                    })}
                                    onPlay={() => {
                                        setVideo((prevVideo) => ({
                                            ...prevVideo, isPlaying: true
                                        }))
                                    }}
                                >
                                    <source src={list.video} type="video/mp4" />
                                </video>
                            </div>
                            <div className='absolute top-12 left-[5%] z-10'>
                                {list.textLists.map(text => <p key={text}
                                    className='md:text-2xl text-xl font-medium'>
                                    {text}
                                </p>)}
                            </div>
                        </div>
                    </div>
                </>)}
            </div>

            <div className='relative flex-center mt-10'>
                <div className='flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full '>
                    {
                        videoRef.current.map((_, i) => (
                            <span
                                key={i}
                                className='mx-2 w-3 h3 bg-gray-200 rounded-full relative cursor-pointer'
                                ref={

                                    (el => {
                                    // @ts-ignore
                                    videoDivRef.current[i] = el
                                })
                                }
                            ></span>
                        ))
                    }


                </div>
            </div>
        </>
    )
}

export default VideoCarousel
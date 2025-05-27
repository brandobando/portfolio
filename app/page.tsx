'use client';

import React, { useEffect, useRef, useState, useMemo, type RefObject } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import VideoPlayer from "@/components/video-player";

const GifPlayer = dynamic(() => import("@/components/gif-player"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-black/10 animate-pulse" />,
});

// Hook to detect visibility with hysteresis thresholds
function useOnScreen(ref: RefObject<Element>): boolean {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!(el instanceof Element)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry.intersectionRatio;
        if (!isVisible && ratio > 0.15) {
          setIsVisible(true);
        } else if (isVisible && ratio < 0.05) {
          setIsVisible(false);
        }
      },
      { threshold: [0, 0.05, 0.15, 1] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, isVisible]);

  return isVisible;
};

const mediaNames = ["space", "ouch", "watch", "timeless", "tonka", "plain", "jazz", "clouds", "funny", "end"];
const reverseNames = ["24", "water", "fire", "rohan", "kanye", "bl", "screen", "joseph", "tame", "trance"];
const additionalGifs = ["/gifs/darkless.gif", "/gifs/a0.gif", "/gifs/vinnie.gif", "/gifs/strive.gif"];

const SECTION_HEIGHT = 1080;
const SECTION_WIDTH = 1920;
const TOTAL_HEIGHT = 8192;

export default function Portfolio() {
  const [pngScale, setPngScale] = useState(0.9);
  const [pngOffsetY, setPngOffsetY] = useState(450);

  const [timestamp, setTimestamp] = useState('');

  useEffect(() => {
    setTimestamp(Date.now().toString());
  }, []);

  const showcaseMedia = useMemo(
    () => mediaNames.map(name => ({ type: 'video', src: `/videos/${name}.mp4?v=${timestamp}` })),
    [timestamp]
  );
  const reverseMedia = useMemo(
    () => reverseNames.map(name => ({ type: 'video', src: `/videos/${name}.mp4?v=${timestamp}` })),
    [timestamp]
  );

  const doubledShowcase = [...showcaseMedia, ...showcaseMedia];
  const doubledReverse = [...reverseMedia, ...reverseMedia];

  const aboutRefs = useRef(mediaNames.slice(0, 7).map(() => React.createRef()));
  const showcaseRefs = useRef(Array.from({ length: doubledShowcase.length }, () => React.createRef()));
  const reverseRefs = useRef(Array.from({ length: doubledReverse.length }, () => React.createRef()));
  const additionalRefs = useRef(Array.from({ length: additionalGifs.length }, () => React.createRef()));

  const [gifConfigs, setGifConfigs] = useState(
    additionalGifs.map(() => ({ scale: 1, offsetX: 0, offsetY: 0 }))
  );

  function updateGifConfig(index: number, newProps: Partial<typeof gifConfigs[0]>) {
    setGifConfigs(cfgs =>
      cfgs.map((cfg, i) => (i === index ? { ...cfg, ...newProps } : cfg))
    );
  }

  useEffect(() => {
    updateGifConfig(0, { scale: 1.5, offsetX: 196, offsetY: 42 });
    updateGifConfig(1, { scale: 1.5, offsetX: 764, offsetY: 550 });
    updateGifConfig(2, { scale: 1.75, offsetX: 250, offsetY: 3075 });
    updateGifConfig(3, { scale: 0, offsetX: 0, offsetY: 0 });
  }, []);

  return (
    <div className="relative mx-auto" style={{ width: `${SECTION_WIDTH}px`, height: `${TOTAL_HEIGHT}px`, overflow: 'visible', margin: '0 auto' }}>
      <div className="absolute top-0 left-0 w-full z-0 pointer-events-none"><GifPlayer src="/gifs/size.gif" /></div>

      {/* Hero Section */}
      <section className="relative w-[1920px] h-[1080px] z-10 flex items-center justify-center">
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-4 text-white text-sm animate-bounce">Scroll Down ↓</div>
        <div className="absolute top-8 left-8">
          <Image src="/images/logo.png" width={150} height={150} alt="Logo" className="logo" loading="eager" />
        </div>
        <Image src="/images/portfolio.png" width={1200} height={600} alt="Title" priority className="z-20 w-full max-w-5xl mx-auto" />
      </section>

      {/* About Section */}
      <section className="w-[1920px] h-[1080px] z-10 flex items-center justify-center">
        <div className="relative w-full max-w-7xl h-full flex items-center justify-center">
          {aboutRefs.current.map((ref, idx) => {
            const num = 7 - idx;
            const vis = useOnScreen(ref);
            return (
              <div
                key={num}
                ref={ref}
                className={`absolute w-full transition-all duration-1000 ease-out transform ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
                style={{ zIndex: num, transitionDelay: `${idx * 150}ms` }}
              >
                <Image
                  src={`/images/about_me_${num}.png`}
                  width={1600}
                  height={900}
                  alt={`About ${num}`}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
            );
          })}
        </div>
      </section>

      <style jsx global>{`
        @keyframes scroll {0% {transform: translateX(0);} 100% {transform: translateX(-50%);} }
        @keyframes scroll-reverse {0% {transform: translateX(-50%);} 100% {transform: translateX(0);} }
        .scroll-animate {animation: scroll 39s linear infinite; will-change: transform; backface-visibility: hidden;}
        .scroll-animate-reverse {animation: scroll-reverse 39s linear infinite; will-change: transform; backface-visibility: hidden;}
        .group:hover .scroll-animate, .group:hover .scroll-animate-reverse {animation-play-state: paused;}
        .gif-wrapper {transition: transform .3s ease; margin-right: 32px; will-change: transform; backface-visibility: hidden;}
        .gif-wrapper:hover {transform: scale(1.1); z-index: 10;}
        .logo:hover {animation: shake .4s ease-in-out;}
        @keyframes shake {0% {transform: translate(0,0) rotate(0);}25% {transform: translate(2px,0) rotate(1deg);}50% {transform: translate(-2px,0) rotate(-1deg);}75% {transform: translate(2px,0) rotate(1deg);}100% {transform: translate(0,0) rotate(0);} }
        html, body { overflow-anchor: none; }
        /* Scale container to viewport width for consistent mobile view */
        
      `}</style>

      {/* Showcase Conveyor */}
      <section className="relative w-full z-10 overflow-hidden py-18 -mt-8">
        <div className="relative w-full overflow-hidden group mb-8 z-10">
          <div className="flex scroll-animate gap-4">
            {doubledShowcase.map((m, i) => {
              const vis = useOnScreen(showcaseRefs.current[i]);
              return vis ? (
                <div key={i} ref={showcaseRefs.current[i]} className="w-[60vw] md:w-[384px] flex-none rounded-lg gif-wrapper">
                  <VideoPlayer key={m.src} src={m.src} autoPlay loop muted playsInline controls={false} />
                </div>
              ) : (
                <div key={i} ref={showcaseRefs.current[i]} className="w-[60vw] md:w-[384px] flex-none" />
              );
            })}
          </div>
        </div>

        <div className="relative w-full overflow-hidden group z-10">
          <div className="flex scroll-animate-reverse gap-4">
            {doubledReverse.map((m, i) => {
              const vis = useOnScreen(reverseRefs.current[i]);
              return vis ? (
                <div key={i} ref={reverseRefs.current[i]} className="w-[60vw] md:w-[384px] flex-none rounded-lg gif-wrapper">
                  <VideoPlayer key={m.src} src={m.src} autoPlay loop muted playsInline controls={false} />
                </div>
              ) : (
                <div key={i} ref={reverseRefs.current[i]} className="w-[60vw] md:w-[384px] flex-none" />
              );
            })}
          </div>
        </div>
      </section>

      {/* 4 MP4 Row */}
      <div className="absolute top-[3775px] w-full z-10">
        <div className="flex justify-center w-full gap-6 px-8">
          {["row1", "row2", "row3", "row4"].map((name, i) => (
            <div key={i} className="w-[20%] max-w-[384px]">
              <VideoPlayer src={`/videos/${name}.mp4?v=${timestamp}`} autoPlay loop muted playsInline controls={false} />
            </div>
          ))}
        </div>
      </div>

      {/* Personal Work Section */}
      <div className="absolute top-[2530px] left-[0px] w-[1920px] h-[1080px] z-0 flex items-center justify-start overflow-visible">
        <Image
          src="/images/personalwork.png"
          width={1080}
          height={2160}
          alt="Personal Work"
          className="w-[1920px] h-[2160px]"
          loading="lazy"
        />
      </div>

      {/* Connected PNG Section */}
      <div className="absolute top-[4150px] left-[0px] w-[1920px] h-[2160px] z-0 flex items-center justify-start overflow-visible">
        <Image
          src="/images/connected.png"
          width={1920}
          height={2160}
          alt="Connected"
          className="w-[1920px] h-[2160px]"
          loading="lazy"
        />
      </div>

      {/* Extended PNG Section */}
      <div className="absolute top-[6310px] left-[0px] w-[1920px] h-[2160px] z-0 flex items-center justify-start overflow-visible">
        <Image
          src="/images/extended.png"
          width={1920}
          height={2160}
          alt="Extended"
          className="w-[1920px] h-[2160px]"
          loading="lazy"
        />
      </div>

      {/* Final PNG Section */}
      <div className="absolute top-[8470px] left-[0px] w-[1920px] h-[2160px] z-0 flex items-center justify-start overflow-visible">
        <Image
          src="/images/final.png"
          width={1920}
          height={2160}
          alt="Final"
          className="w-[1920px] h-[2160px]"
          loading="lazy"
        />
      </div>

      {/* Vertical Reels */}
      <div className="absolute top-[5190px] left-0 w-full z-10">
        <div className="flex justify-evenly w-full gap-4 flex-wrap">
          {["vertical1", "vertical2", "vertical3", "vertical4", "vertical5"].map((name, i) => (
            <div key={i} className="flex-none aspect-[9/16] w-[45%] md:w-[15%]">
              <VideoPlayer src={`/videos/${name}.mp4?v=${timestamp}`} autoPlay loop muted playsInline controls={false} />
            </div>
          ))}
        </div>
      </div>

            {/* 1:1 MP4 Independent Row */}
      <div className="absolute top-[7160px] left-[-90px] w-full z-10">
        <div className="flex justify-center w-full gap-2 px-8">
          {["square1", "square2", "square3"].map((name, i) => (
            <div key={i} className="w-[10%] aspect-square max-w-[200px] rounded-full overflow-hidden">
              <VideoPlayer src={`/videos/${name}.mp4?v=${timestamp}`} autoPlay loop muted playsInline controls={false} />
            </div>
          ))}
        </div>
      </div>

{/* 3 MP4 Independent Row */}
      <div className="absolute top-[7550px] left-0 w-full z-10">
        <div className="flex justify-center w-full gap-4 px-8">
          {["indep1", "indep2", "indep3"].map((name, i) => (
            <div key={i} className="w-[25%] max-w-[384px]">
              <VideoPlayer src={`/videos/${name}.mp4?v=${timestamp}`} autoPlay loop muted playsInline controls={false} />
            </div>
          ))}
        </div>
      </div>

      {/* Additional GIFs */}
      <section className="absolute top-[2600px] w-full z-10 py-32">
        <div className="flex flex-col items-center justify-center h-full px-4 py-16 gap-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 w-full">
            {additionalGifs.map((src, i) => {
              const { scale: gifScale, offsetX, offsetY } = gifConfigs[i];
              return (
                <div
                  key={i}
                  ref={additionalRefs.current[i]}
                  className="rounded-lg overflow-hidden"
                  style={{ transform: `translate(${offsetX}px, ${offsetY}px) scale(${gifScale})` }}
                >
                  <GifPlayer src={src} />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

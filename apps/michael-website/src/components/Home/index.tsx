import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import imagesLoaded, { ImagesLoaded } from 'imagesloaded';
import { sketchingImages } from './constants';

gsap.registerPlugin(ScrollTrigger);

const HomeComponent: React.FC = () => {
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const randomImages = sketchingImages.sort(() => Math.random() - 0.5);
  const getImage = async () => {
    return await Promise.all(randomImages);
  };

  useEffect(() => {
    const images = Array.from(
      document.querySelectorAll<HTMLImageElement>('img'),
    );
    const loader = loaderRef.current;

    const updateProgress = (instance: ImagesLoaded) => {
      if (loader) {
        loader.textContent = `${Math.round(
          (instance.progressedCount * 100) / images.length,
        )}%`;
      }
    };

    const showDemo = () => {
      document.body.style.overflow = 'auto';
      document.scrollingElement?.scrollTo(0, 0);
      gsap.to(loaderRef.current, { autoAlpha: 0 });

      gsap.utils.toArray<HTMLElement>('section').forEach((section, index) => {
        const wrapper = section.querySelector('.wrapper') as HTMLElement;
        if (!wrapper) return;

        const [x, xEnd] =
          index % 2
            ? [wrapper.scrollWidth * -1, 0]
            : ['100%', (wrapper.scrollWidth - section.offsetWidth) * -1];

        gsap.fromTo(
          wrapper,
          { x },
          {
            x: xEnd,
            scrollTrigger: {
              trigger: section,
              scrub: 0.5,
            },
          },
        );
      });
    };

    const imgLoad = imagesLoaded(images);
    imgLoad.on('progress', updateProgress).on('always', showDemo);
  }, []);

  return (
    <div>
      {/* Loader */}
      <div
        ref={loaderRef}
        className="loader fixed inset-0 bg-black text-white flex items-center justify-center"
      >
        <h1>Loading</h1>
        <h2 className="loader--text text-2xl">0%</h2>
      </div>

      {/* Demo Wrapper */}
      <div className="demo-wrapper overflow-x-hidden">
        <header className="h-screen flex items-center justify-center">
          <div>
            <h1 className="text-5xl font-bold">Hi I am Michael Shen</h1>
            <h2 className="text-2xl">
              A software engineer and also a sketching artist
            </h2>
            <h3>Scroll down to see all my works</h3>
          </div>
        </header>

        {/* Sections */}
        <section className="demo-text">
          <div className="wrapper text flex text-[clamp(8rem,15vw,16rem)] font-black whitespace-nowrap">
            My sketching artworks
          </div>
        </section>

        {[...Array(4)].map((_, i) => (
          <section className="demo-gallery py-4" key={i}>
            <ul className="wrapper flex space-x-4">
              {randomImages.map((image, index) => (
                <li
                  key={index}
                  className="flex-shrink-0 w-[clamp(500px,60vw,800px)]"
                >
                  <img
                    src={image}
                    alt="Random Unsplash"
                    className="w-full h-auto bg-gray-200"
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="demo-text">
          <div className="wrapper text flex text-[clamp(8rem,15vw,16rem)] font-black whitespace-nowrap">
            ABCDEFGHIJKLMNOPQRSTUVWXYZ
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomeComponent;

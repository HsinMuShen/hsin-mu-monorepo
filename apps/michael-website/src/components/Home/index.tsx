import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import imagesLoaded, { ImagesLoaded } from 'imagesloaded';

gsap.registerPlugin(ScrollTrigger);

const HomeComponent: React.FC = () => {
  const loaderRef = useRef<HTMLDivElement | null>(null);

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
            ? ['100%', (wrapper.scrollWidth - section.offsetWidth) * -1]
            : [wrapper.scrollWidth * -1, 0];

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
            <h1 className="text-5xl font-bold">ScrollTrigger</h1>
            <h2 className="text-2xl">demo</h2>
          </div>
        </header>

        {/* Sections */}
        <section className="demo-text">
          <div className="wrapper text flex text-[clamp(8rem,15vw,16rem)] font-black whitespace-nowrap">
            ABCDEFGHIJKLMNOPQRSTUVWXYZ
          </div>
        </section>

        {[...Array(4)].map((_, i) => (
          <section className="demo-gallery py-4" key={i}>
            <ul className="wrapper flex space-x-4">
              {[...Array(Math.floor(Math.random() * (4 - 3 + 1)) + 3)].map(
                (_, j) => (
                  <li
                    key={j}
                    className="flex-shrink-0 w-[clamp(500px,60vw,800px)]"
                  >
                    <img
                      src={`https://source.unsplash.com/random/1240x874?sig=${
                        Math.random() * 200
                      }`}
                      alt="Random Unsplash"
                      className="w-full h-auto bg-gray-200"
                    />
                  </li>
                ),
              )}
            </ul>
          </section>
        ))}

        <section className="demo-text">
          <div className="wrapper text flex text-[clamp(8rem,15vw,16rem)] font-black whitespace-nowrap">
            ABCDEFGHIJKLMNOPQRSTUVWXYZ
          </div>
        </section>

        <footer className="h-[50vh] flex items-center justify-center">
          <p>
            Images from{' '}
            <a href="https://unsplash.com/" className="text-green-700">
              Unsplash
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default HomeComponent;

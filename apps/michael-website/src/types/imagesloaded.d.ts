declare module 'imagesloaded' {
  type EventName = 'progress' | 'always';

  interface LoadedImage {
    isLoaded: boolean;
    img: HTMLImageElement;
    element: HTMLElement;
  }

  interface ImagesLoaded {
    images: LoadedImage[];
    progressedCount: number;
    on(
      event: EventName,
      listener: (instance: ImagesLoaded, image?: LoadedImage) => void,
    ): ImagesLoaded;
  }

  export default function imagesLoaded(
    elements: NodeListOf<HTMLImageElement> | HTMLImageElement[],
  ): ImagesLoaded;
}

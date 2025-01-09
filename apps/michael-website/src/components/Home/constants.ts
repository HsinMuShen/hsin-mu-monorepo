import hometown from '@/assets/images/sketching/hometown.jpg';
import east_market from '@/assets/images/sketching/east_market.jpg';
import construction from '@/assets/images/sketching/construction.jpg';
import sea_temple from '@/assets/images/sketching/sea_temple.jpg';
import taipei_elevation from '@/assets/images/sketching/taipei_elevation.jpg';
import chiayi_sky from '@/assets/images/sketching/chiayi_sky.jpg';
import dynamic from '@/assets/images/sketching/dynamic.jpg';
// import all images from @/assets/images/sketching
const sketchImages = import.meta.glob('@/assets/images/sketching/*.jpg');

// export const sketchImages = [
//   hometown,
//   east_market,
//   construction,
//   sea_temple,
//   taipei_elevation,
//   chiayi_sky,
//   dynamic,
// ];

export const sketchingImages = Object.values(sketchImages);

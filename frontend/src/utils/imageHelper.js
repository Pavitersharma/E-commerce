import cap from '../assets/images/cap.png';
import cloth from '../assets/images/cloth.png';
import jacket from '../assets/images/jacket.png';
import jeans from '../assets/images/jeans.png';
import jeans3 from '../assets/images/jeans3.webp';
import polotshirt from '../assets/images/polotshirt.webp';
import shirt2 from '../assets/images/shirt2.png';
import shirt3 from '../assets/images/shirt3.webp';
import shirt5 from '../assets/images/shirt5.jpg';
import shirtlist from '../assets/images/shirtlist.webp';
import shoes from '../assets/images/shoes.png';
import shoes2 from '../assets/images/shoes2.webp';
import trouser2 from '../assets/images/trouser2.jpg';
import tshirt from '../assets/images/tshirt.png';
import underwear from '../assets/images/underwear.png';
import wallet from '../assets/images/wallet.webp';
import watch from '../assets/images/watch.png';
import watches2 from '../assets/images/watches2.avif';

const mapping = {
  "cap.png": cap,
  "cloth.png": cloth,
  "jacket.png": jacket,
  "jeans.png": jeans,
  "jeans3.webp": jeans3,
  "polotshirt.webp": polotshirt,
  "shirt2.png": shirt2,
  "shirt3.webp": shirt3,
  "shirt5.jpg": shirt5,
  "shirtlist.webp": shirtlist,
  "shoes.png": shoes,
  "shoes2.webp": shoes2,
  "trouser2.jpg": trouser2,
  "tshirt.png": tshirt,
  "underwear.png": underwear,
  "wallet.webp": wallet,
  "watch.png": watch,
  "watches2.avif": watches2
};

export const getImageAsset = (imageName) => {
  // If the path contains folders/slashes, get the base filename
  const filename = imageName ? imageName.split('/').pop() : '';
  return mapping[filename] || cloth;
};

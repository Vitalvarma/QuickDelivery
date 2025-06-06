import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';

const CloudinaryUtil = (inputImage) => {
  const cld = new Cloudinary({ cloud: { cloudName: 'dxxqdpuc7' } });
  
  const img = cld
        .image(inputImage)
        .format('auto') 
        .quality('auto')
        .resize(auto().gravity(autoGravity()).width(500).height(500)); 

  return img;
};

export default CloudinaryUtil;


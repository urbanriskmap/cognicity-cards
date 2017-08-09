import {noView} from 'aurelia-framework';

//start-aurelia-decorators
@noView
//end-aurelia-decorators
export class ImageUtility {
  drawImage(degrees, wrapper, wrapper_id, file) {
    return new Promise(function(resolve, reject) {
      var cntxt = wrapper.getContext('2d');
      wrapper.width = $('#' + wrapper_id).width();
      wrapper.height = $('#' + wrapper_id).height();
      let reader = new FileReader();
      reader.onload = (e) => {
        let reviewImg = new Image();
        reviewImg.onload = () => {
          let imgW;
          let imgH;
          let trlX = -wrapper.width/2;
          let trlY = -wrapper.height/2;
          if (reviewImg.width >= reviewImg.height) {
            imgH = wrapper.height;
            imgW = Math.round((reviewImg.width * imgH) / reviewImg.height);
            trlX = trlX + Math.round((wrapper.width - imgW) / 2);
          } else {
            imgW = wrapper.width;
            imgH = Math.round((reviewImg.height * imgW) / reviewImg.width);
            trlY = trlY + Math.round((wrapper.height - imgH) / 2);
          }
          cntxt.translate(wrapper.width / 2, wrapper.height / 2);
          cntxt.rotate(degrees * Math.PI / 180);
          cntxt.drawImage(reviewImg, trlX, trlY, imgW, imgH);
        };
        reviewImg.src = e.target.result;
      };
      reader.readAsDataURL(file);
      resolve(null);
    });
  }
}

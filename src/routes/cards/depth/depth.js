import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import $ from 'jquery';
import {ReportCard} from 'utility/report-card';

//start-aurelia-decorators
@inject(EventAggregator, ReportCard)
//end-aurelia-decorators
export class Depth {
  constructor(ea, ReportCard) {
    this.ea = ea;
    this.reportcard = ReportCard;
    this.sliderActive = false;
    //Check for mobile or desktop device
    if (/Mobi/.test(navigator.userAgent)) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
    this.height_params = {
      cm: {
        imgHeight: 220,
        maxHtLimit: 195,
        minHtLimit: 1
      },
      in: {
        imgHeight: 87,
        maxHtLimit: 77,
        minHtLimit: 1
      }
    };
  }

  attached() {
    $(document).ready(() => { //TODO: test if required
      var self = this,
          heightParams = this.height_params[this.reportcard.config.height_units],
          refHeightPx = $('#bgImage').height(),
          fillHeightPx,
          reportHeight;
      if (self.reportcard.depth) {
        //reset value within limits
        if (self.reportcard.depth > heightParams.maxHtLimit) {
          reportHeight = heightParams.maxHtLimit;
        } else if (self.reportcard.depth < heightParams.minHtLimit) {
          reportHeight = heightParams.minHtLimit;
        }
        $('#floodZone').css({
          'height': (self.reportcard.depth * refHeightPx / heightParams.imgHeight) + 'px'
        });
      }
      fillHeightPx = $('#floodZone').height();
      $('#sliderZone').css({
        'bottom': fillHeightPx + 'px'
      });
      reportHeight = (fillHeightPx * heightParams.imgHeight) / refHeightPx;
      self.reportcard.depth = Math.round(reportHeight);

      //Touch start
      $('#sliderZone').on('touchstart mousedown', function (e) {
        self.sliderActive = true;
        $('.knobHelper').fadeOut(100);
        $('#knob').css({
          'box-shadow': '0px 0px 12px 8px rgba(179, 214, 239, 0.5)'
        });
        var startPos;
        if (self.isMobile) {
          startPos = e.originalEvent.touches[0].pageY;
        } else {
          startPos = e.clientY;
        }

        //Drag start
        $('.cardContentWrapper').on('touchmove mousemove', function (e) {
          var dragPos;
          if (self.isMobile) {
            e.preventDefault();
            dragPos = e.originalEvent.touches[0].pageY;
          } else {
            dragPos = e.clientY;
          }
          reportHeight = ((fillHeightPx + startPos - dragPos) * heightParams.imgHeight) / refHeightPx;
          if (self.sliderActive) {
            self.ea.publish('depthSlider', 'dragStart');
            if (reportHeight > heightParams.minHtLimit && reportHeight < heightParams.maxHtLimit) {
              $('#floodZone').css({
                'height': (fillHeightPx + startPos - dragPos) + 'px'
              });
              $('#sliderZone').css({
                'bottom': (fillHeightPx + startPos - dragPos) + 'px'
              });
              self.reportcard.depth = Math.round(reportHeight);
            } else if (reportHeight >= heightParams.maxHtLimit) {
              $('#floodZone').css({
                'height': ((refHeightPx * heightParams.maxHtLimit) / heightParams.imgHeight) + 'px'
              });
              $('#sliderZone').css({
                'bottom': ((refHeightPx * heightParams.maxHtLimit) / heightParams.imgHeight) + 'px'
              });
              self.reportcard.depth = heightParams.maxHtLimit;
            } else if (reportHeight <= heightParams.minHtLimit) {
              $('#floodZone').css({
                'height': heightParams.minHtLimit + 'px'
              });
              $('#sliderZone').css({
                'bottom': heightParams.minHtLimit + 'px'
              });
              self.reportcard.depth = heightParams.minHtLimit;
            }
          }
        });
      });

      //Drag end
      $(document).on('touchend mouseup', function () {
        if (self.sliderActive) {
          self.sliderActive = false;
          $('#knob').css({
            'box-shadow': '0px 0px 12px 8px rgba(49, 170, 222, 0.4)'
          });
          $('.knobHelper').fadeIn(200);
          fillHeightPx = $('#floodZone').height();
        }
      });
    });
  }
}

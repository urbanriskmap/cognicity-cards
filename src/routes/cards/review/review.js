import {ReportCard} from 'utility/report-card';
import {ImageUtility} from 'utility/image-utility';
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

//start-aurelia-decorators
@inject(ReportCard, EventAggregator, ImageUtility)
//end-aurelia-decorators
export class Review {
  constructor(ReportCard, EventAggregator, ImageUtility) {
    this.reportcard = ReportCard;
    this.imgutility = ImageUtility;
    this.ea = EventAggregator;

    //Construct card_data param in accordance with disaster_type
    let card_data;
    let damageDescriptions = '';
    switch (true) {
      case (this.reportcard.disaster_type === 'prep'):
        card_data = {report_type: this.reportcard.reportType};
        break;

      case (this.reportcard.disaster_type === 'flood'):
        card_data = {report_type: 'flood', flood_depth: Math.round(this.reportcard.depth)};
        break;

      case (this.reportcard.disaster_type === 'assessment'):
        card_data = {report_type: 'assessment', damages: []};
        for (const component of Object.keys(this.reportcard.damages)) {
          // Check for damages selected
          if (this.reportcard.damages[component]
            && this.reportcard.damages[component] !== 'No') {
            // Store severity
            card_data.damages.push({
              component: component,
              severity: this.reportcard.damages[component]
            });
          }
        }

        for (const textObject of this.reportcard.damageDescriptions) {
          damageDescriptions += Object.keys(textObject)[0] + ': '
          + textObject[Object.keys(textObject)[0]] + '; '; // new line not working using &#10; or &#13;
        }
    }

    let reportDescription = '';
    if (this.reportcard.description.value) {
      reportDescription += this.reportcard.description.value;
    }
    if (damageDescriptions) {
      reportDescription += damageDescriptions;
    }

    //Construct report object for submission
    this.report = {
      disaster_type: this.reportcard.disaster_type,
      card_data: card_data,
      text: reportDescription,
      created_at: new Date().toISOString(),
      image_url: '',
      location: this.reportcard.location.markerLocation
    };
    //Construct image object separately
    this.imageObject = this.reportcard.photo.file;

    //Check for mobile or desktop device
    if (/Mobi/.test(navigator.userAgent)) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  checkRequiredInputs() { //TODO: Add checks for file / data types
    if (this.report.location && this.report.card_data.report_type && (this.imageObject || this.report.text)) {
      return true;
    } else {
      return false;
    }
  }

  attached() {
    if (this.imageObject) {
      this.imgutility.drawImage(this.reportcard.photo.rotation, this.preview, 'photo', this.reportcard.photo.file[0]);
    }

    var self = this;

    if (this.checkRequiredInputs()) {
      var slideRange = $('#submitSlider').width() - $('#submitKnob').width(),
          slideThreshold = 0.9,
          slideTranslate = 0,
          slidePressed = false;
      self.swiped = false;

      //Slider touch start
      $('#submitKnob').on('touchstart mousedown', function (e) {
        var slideStartPos;
        if (self.isMobile) {
          slideStartPos = e.originalEvent.touches[0].pageX;
        } else {
          slideStartPos = e.clientX;
        }
        slidePressed = true;

        //Drag start
        $('#reviewWrapper').on('touchmove mousemove', function (e) {
          var slideDragPos;
          if (self.isMobile) {
            e.preventDefault();
            slideDragPos = e.originalEvent.touches[0].pageX;
          } else {
            slideDragPos = e.clientX;
          }
          slideTranslate = slideDragPos - slideStartPos;
          if (slidePressed && slideTranslate >= 0 && slideTranslate < slideRange) {
            $('#submitKnob').css({
              'left': slideTranslate + 'px'
            });
            $('#submitSlider').css({
              'background-color': 'rgba(31, 73, 99, ' + (slideTranslate / (slideThreshold * slideRange)) + ')'
            });

            //Swipe threshold crossed
            if (slideTranslate >= (slideThreshold * slideRange) && !self.swiped) {
              self.swiped = true;
              slidePressed = false;
              //Pass message to App, for report submission
              self.ea.publish('submit', {
                report: self.report,
                photo: self.imageObject,
                id: self.reportcard.id
              });
            }
          }
        });

        //Drag end
        $(window).on('touchend mouseup', function () {
          if (slidePressed && slideTranslate < (slideThreshold * slideRange) && !self.swiped) {
            slidePressed = false;
            $('#submitKnob').animate({ //Swing back to start position
              'left': 0 + 'px'
            }, 50);
            $('#submitSlider').css({ //Reset slider background
              'background-color': 'transparent'
            });
          }
        });
      });
    } else {
      $('#submitKnob').css({
        'background-color': '#a0a0a0'
      });
    }
  }

  readTerms() {
    this.ea.publish('readTerms', 'click');
  }
}

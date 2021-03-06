import {inject} from 'aurelia-framework';
import {ReportCard} from 'utility/report-card';

//start-aurelia-decorators
@inject(ReportCard)
//end-aurelia-decorators
export class Description {
  constructor(ReportCard) {
    this.reportcard = ReportCard;
    if (/Mobi/.test(navigator.userAgent)) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  clearText() {
    this.reportcard.description.value = null;
  }

  onBlur() {
    if (this.isMobile) {
      this.focussed = false;
      $('#textArea').css({
        'height': 192 + 'px'
      });
    }
  }

  onFocus() {
    if (this.isMobile) {
      this.focussed = true;
      $('#textArea').css({
        'height': 80 + 'px'
      });
    }
  }

  setFocus() {
    $('#textArea').focus();
    this.onFocus();
  }
}

import {inject} from 'aurelia-framework';
import $ from 'jquery';
import {ReportCard} from 'utility/report-card';
import {EventAggregator} from 'aurelia-event-aggregator';

//start-aurelia-decorators
@inject(EventAggregator, ReportCard)
//end-aurelia-decorators

export class Prep {
  constructor(ea, ReportCard) {
    this.ea = ea;
    this.reportcard = ReportCard;
    this.btnList = ["drain", "desilting", "canalrepair", "treeclearing"]; //elements match names of fontello icons
  }

  attached() {
    if (this.reportcard.reportType) {
      var btnName = this.reportcard.reportType;
      this.switchbtn(btnName);
    }
  }

  switchbtn(btnName) {
    $('.prepLabels').addClass("inactive");
    $('#button-' + btnName).removeClass("inactive");
    $('#button-' + btnName).addClass("active");
    this.reportcard.reportType = btnName;
  }
}

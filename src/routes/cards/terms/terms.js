import $ from 'jquery';
import {ReportCard} from 'utility/report-card';
import {inject} from 'aurelia-framework';

//start-aurelia-decorators
@inject(ReportCard)
//end-aurelia-decorators
export class Terms {
  constructor(ReportCard) {
    this.reportcard = ReportCard;
    this.tab = 'u_a';
  }

  switchTab(tabName) {
    $('.tabs').removeClass('active');
    $('#tab-' + tabName).addClass('active');
    this.tab = tabName;
  }

  attached() {
    this.switchTab('u_a');
  }
}

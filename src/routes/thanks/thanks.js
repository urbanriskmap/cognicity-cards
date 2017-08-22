import {ReportCard} from 'utility/report-card';
import {inject} from 'aurelia-framework';

//start-aurelia-decorators
@inject(ReportCard)
//end-aurelia-decorators
export class Thanks {
  constructor(ReportCard) {
    this.reportcard = ReportCard;
  }

  attached() {
    var self = this;
    self.network_name = this.reportcard.network.charAt(0).toUpperCase() + this.reportcard.network.slice(1);
    window.setTimeout(function () {
      window.location.replace(self.reportcard.config.map_page);
    }, 3000);
  }
}

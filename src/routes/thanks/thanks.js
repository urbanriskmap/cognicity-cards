import {ReportCard} from 'utility/report-card';
import {inject} from 'aurelia-framework';

//start-aurelia-decorators
@inject(ReportCard)
//end-aurelia-decorators
export class Thanks {
  constructor(ReportCard) {
    this.reportcard = ReportCard;
  }

  activate(params, routerConfig) {
    this.thanksCode = routerConfig.settings.code;
  }

  attached() {
    var self = this;
    //self.network_name = this.reportcard.network.charAt(0).toUpperCase() + this.reportcard.network.slice(1);
  }
}

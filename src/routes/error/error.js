import {inject} from 'aurelia-framework';
import {ReportCard} from 'utility/report-card';

//start-aurelia-decorators
@inject(ReportCard)
//end-aurelia-decorators
export class Error {
  constructor(ReportCard) {
    this.reportcard = ReportCard;
  }

  activate(params, routerConfig) {
    this.errorCode = routerConfig.settings.errorCode;
    this.errorText = routerConfig.settings.errorText;
  }
}

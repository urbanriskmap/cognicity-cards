import {inject} from 'aurelia-framework';
import {ReportCard} from 'utility/report-card';
import storeDamage from 'services/assessment-service';

//start-aurelia-decorators
@inject(ReportCard)
//end-aurelia-decorators

export class Roof {
  constructor(ReportCard) {
    this.reportcard = ReportCard;
  }

  storeRoofDamage(severity) {
    this.reportcard = storeDamage('roof', severity, this.reportcard);
  }
}

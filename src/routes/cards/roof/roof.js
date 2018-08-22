import {inject} from 'aurelia-framework';
import {ReportCard} from 'utility/report-card';
import assessment from 'services/assessment-service';

//start-aurelia-decorators
@inject(ReportCard)
//end-aurelia-decorators

export class Roof {
  constructor(ReportCard) {
    this.reportcard = ReportCard;
  }

  registerDamage(isDamaged) {
    this.reportcard = assessment.registerDamage('roof', isDamaged, this.reportcard);
  }

  storeSeverity(severity) {
    this.reportcard = assessment.storeSeverity('roof', severity, this.reportcard);
  }
}

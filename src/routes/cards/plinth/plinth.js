import {inject} from 'aurelia-framework';
import {ReportCard} from 'utility/report-card';
import assessment from 'services/assessment-service';

//start-aurelia-decorators
@inject(ReportCard, assessment)
//end-aurelia-decorators

export class Plinth {
  constructor(ReportCard, assessment) {
    this.reportcard = ReportCard;
    this.assessment = assessment;
  }
}

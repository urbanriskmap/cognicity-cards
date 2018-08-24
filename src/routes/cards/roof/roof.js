import {inject} from 'aurelia-framework';
import {ReportCard} from 'utility/report-card';
import assessment from 'services/assessment-service';

//start-aurelia-decorators
@inject(ReportCard, assessment)
//end-aurelia-decorators

export class Roof {
  name = 'roof';
  previouslyReportedDamage;
  previouslyFilledSeverity;
  previouslyFilledDescription;

  constructor(ReportCard, assessment) {
    this.reportcard = ReportCard;
    this.assessment = assessment;
  }

  attached() {
    if (this.reportcard.damages[name] !== null) {
      previouslyReportedDamage = 'Yes';
      previouslyFilledSeverity = this.reportcard.damages[name];
      previouslyFilledDescription = this.assessment.fetchPreviousInputs(
        'roof', this.reportcard
      );
    }
  }
}

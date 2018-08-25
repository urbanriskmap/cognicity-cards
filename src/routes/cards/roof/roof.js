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
    const previousInputs = this.assessment.fetchPreviousInputs(
      'roof', this.reportcard
    );

    if (previousInputs.severity !== null) {
      if (previousInputs.severity === 0) {
        this.previouslyReportedDamage = 'No';
      } else {
        this.previouslyReportedDamage = 'Yes';
        this.previouslyFilledSeverity = previousInputs.severity;
        this.previouslyFilledDescription = previousInputs.description;
      }
    }
  }
}

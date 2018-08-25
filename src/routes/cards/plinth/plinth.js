import {inject} from 'aurelia-framework';
import {AssessmentService} from 'services/assessment-service';

//start-aurelia-decorators
@inject(AssessmentService)
//end-aurelia-decorators
export class Plinth {
  name = 'plinth';
  previouslyReportedDamage;
  previouslyFilledSeverity;
  previouslyFilledDescription;

  constructor(AssessmentService) {
    this.assessment = AssessmentService;
  }

  attached() {
    const previousInputs = this.assessment
    .fetchPreviousInputs(this.name, this.reportcard);

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

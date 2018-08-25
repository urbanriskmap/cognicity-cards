import {noView, inject} from 'aurelia-framework';
import {ReportCard} from 'utility/report-card';

//start-aurelia-decorators
@noView
@inject(ReportCard)
//end-aurelia-decorators
export class AssessmentService {
  constructor(ReportCard) {
    this.reportcard = ReportCard;
  }

  fetchPreviousInputs(component) {
    if (this.reportcard.damages[component] !== null) {
      // Previously reported Yes or No
      if (this.reportcard.damages[component] === 0) {
        // Reported No
        return {severity: 0, description: null};
      } else {
        // Reported Yes
        let text;
        if (this.reportcard.damageDescriptions.length) {
          for (const description of this.reportcard.damageDescriptions) {
            if (description.hasOwnProperty(component)) {
              text = description[component];
            }
          }
        }
        return {
          severity: this.reportcard.damages[component],
          description: text
        };
      }
    } else {
      // Not reported yet, first prompt
      return {severity: null, description: null};
    }
  }

  checkDamage(component, isDamaged) {
    if (isDamaged === 'No') {
      // Set damages for component as 0
      this.reportcard.damages[component] = 0;

      this.clearDamageDescriptions(component);
    } else {
      // Clicked 'Yes', set damages as null to disable NEXT button
      // Will be enabled when severity is selected
      this.reportcard.damages[component] = null;
    }
  }

  storeSeverity(component, severity) {
    this.reportcard.damages[component] = severity;
  }

  storeDamageDescription(component, text) {
    let hasExistingText;

    if (this.reportcard.damageDescriptions.length) {
      for (const description of this.reportcard.damageDescriptions) {
        if (description.hasOwnProperty(component)) {
          description[component] = text;
          hasExistingText = true;
        }
      }
    }

    if (!hasExistingText) {
      const descriptionObject = {};
      descriptionObject[component] = text;

      this.reportcard.damageDescriptions.push(descriptionObject);
    }
  }

  clearDamageDescriptions(component) {
    for (let i = 0; i < this.reportcard.damageDescriptions.length; i += 1) {
      if (this.reportcard.damageDescriptions[i].hasOwnProperty(component)) {
        this.reportcard.damageDescriptions.splice(i, 1);
      }
    }
  }
}

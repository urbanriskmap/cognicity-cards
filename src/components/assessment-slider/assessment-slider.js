import {bindable, customElement} from 'aurelia-framework';

//start-aurelia-decorators
@customElement('assessment-slider')
//end-aurelia-decorators
export class AssessmentSlider {
  //@bindable attributes should have no case, eg. reportcard
  //@bindable functions should be in camelCase, then in html template usage, use camel-case.call
  //start-aurelia-decorators
  @bindable relaySeverity;
  //end-aurelia-decorators

  severityList = [
    'minor',
    'moderate',
    'major'
  ];
  selectedSeverity = '';

  attached() {
    // Reset selectedSeverity for
    // a 'Yes' > 'No' > 'Yes' sequence
    this.selectedSeverity = '';
  }

  selectSeverity(severity) {
    this.selectedSeverity = severity;
    this.relaySeverity(this.selectedSeverity);
  }
}

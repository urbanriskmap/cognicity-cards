import {bindable, customElement} from 'aurelia-framework';

//start-aurelia-decorators
@customElement('assessment-slider')
//end-aurelia-decorators
export class AssessmentSlider {
  //@bindable attributes should have no case, eg. reportcard
  //@bindable functions should be in camelCase, then in html template usage, use camel-case.call
  //start-aurelia-decorators
  @bindable relaySeverity;
  @bindable selectedSeverity;
  @bindable locale;

  severityList = [
    {grade: 1, code: 'grade_1'},
    {grade: 2, code: 'grade_2'},
    {grade: 3, code: 'grade_3'},
    {grade: 4, code: 'grade_4'},
    {grade: 5, code: 'grade_5'}
  ];

  attached() {
    // Reset selectedSeverity for
    // a 'Yes' > 'No' > 'Yes' sequence
    this.selectedSeverity = null;
  }

  selectSeverity(severity) {
    this.selectedSeverity = severity;
    this.relaySeverity(this.selectedSeverity);
  }
}

import {customElement} from 'aurelia-framework';

//start-aurelia-decorators
@customElement('assessment-slider')
//end-aurelia-decorators
export class AssessmentSlider {
  //@bindable attributes should have no case, eg. reportcard
  //@bindable functions should be in camelCase, then in html template usage, use camel-case.call

  severityList = [
    'minor',
    'moderate',
    'major'
  ];
  selectedSeverity = '';

  attached() {
  //
  }

  selectSeverity(severity) {
    this.selectedSeverity = severity;
    console.log(severity);
  }
}

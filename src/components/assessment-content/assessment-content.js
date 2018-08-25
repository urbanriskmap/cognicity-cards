import {bindable, customElement} from 'aurelia-framework';

//start-aurelia-decorators
@customElement('assessment-content')
//end-aurelia-decorators
export class AssessmentContent {
  //@bindable attributes should have no case, eg. reportcard
  //@bindable functions should be in camelCase, then in html template usage, use camel-case.call
  //start-aurelia-decorators
  @bindable name;
  @bindable isdamaged;
  @bindable selectedseverity;
  @bindable description;
  @bindable relayDamage;
  @bindable relaySeverity;
  @bindable relayText;
  @bindable locale;
  //end-aurelia-decorators

  damageSelectors = ['No', 'Yes'];

  selectDamage(isDamaged) {
    this.isdamaged = isDamaged;

    // Store damage input, descriptions
    this.relayDamage(this.isdamaged);

    // Update class properties to clear DOM elements
    // Reset severity, description
    if (isDamaged === 'No') {
      this.selectedseverity = null;
      this.description = '';
    }
  }

  storeSeverity(severity) {
    this.selectedseverity = severity;

    // Store severity inputs
    this.relaySeverity(this.selectedseverity);
  }
}

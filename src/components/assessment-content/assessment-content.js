import {bindable, customElement} from 'aurelia-framework';

//start-aurelia-decorators
@customElement('assessment-content')
//end-aurelia-decorators
export class AssessmentContent {
  //@bindable attributes should have no case, eg. reportcard
  //@bindable functions should be in camelCase, then in html template usage, use camel-case.call
  //start-aurelia-decorators
  @bindable relaySeverity;
  @bindable locale;
  @bindable name;
  @bindable relayDamage;
  //end-aurelia-decorators

  damageSelectors = ['No', 'Yes'];
  isDamaged = null;

  selectDamage(damaged) {
    this.isDamaged = damaged;
    this.relayDamage(this.isDamaged);
  }
}

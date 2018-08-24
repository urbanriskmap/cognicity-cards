import {bindable, customElement} from 'aurelia-framework';

//start-aurelia-decorators
@customElement('assessment-content')
//end-aurelia-decorators
export class AssessmentContent {
  //@bindable attributes should have no case, eg. reportcard
  //@bindable functions should be in camelCase, then in html template usage, use camel-case.call
  //start-aurelia-decorators
  @bindable name;
  @bindable isDamaged;
  @bindable selectedSeverity;
  @bindable description;
  @bindable relaySeverity;
  @bindable relayDamage;
  @bindable relayText;
  @bindable locale;
  //end-aurelia-decorators

  damageSelectors = ['No', 'Yes'];

  attached() {
    this.description = '';
  }

  selectDamage(damaged) {
    this.isDamaged = damaged;
    this.relayDamage(this.isDamaged);

    if (damaged === 'No') this.description = '';
  }
}

import {bindable, customElement} from 'aurelia-framework';

//start-aurelia-decorators
@customElement('nav-buttons')
//end-aurelia-decorators
export class NavButtons {
  //@bindable attributes should have no case, eg. reportcard
  //@bindable functions should be in camelCase, then in html template usage, use camel-case.call
  //start-aurelia-decorators
  @bindable prevlabel;
  @bindable nextlabel;
  @bindable prevCard;
  @bindable nextCard;
  @bindable count;
  @bindable nextdisabled;
  //end-aurelia-decorators

  attached() {
    var self = this;

  }
}

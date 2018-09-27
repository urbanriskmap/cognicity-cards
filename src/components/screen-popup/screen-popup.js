import {bindable, customElement} from 'aurelia-framework';

//start-aurelia-decorators
@customElement('screen-popup')
//end-aurelia-decorators
export class ScreenPopup {
  //start-aurelia-decorators
  @bindable cities;
  @bindable selcity;
  @bindable switchCity;
  //end-aurelia-decorators

  constructor() {
  }


  attached() {
  }
}

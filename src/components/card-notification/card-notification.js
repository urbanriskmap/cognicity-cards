import {bindable, customElement} from 'aurelia-framework';

//start-aurelia-decorators
@customElement('card-notification')
//end-aurelia-decorators
export class CardNotification {
  //@bindable attributes do not work with camelCase...
  //start-aurelia-decorators
  @bindable locale;
  @bindable type;
  @bindable header;
  @bindable message;
  @bindable bespoke;
  @bindable closeNotification;
  //end-aurelia-decorators

  callClose() {
    if ($('#notifyWrapper').hasClass('active')) {
      //$('#notifyWrapper').finish();
      $('#notifyWrapper').dequeue();
      $('#notifyWrapper').slideUp(300);
    }
  }
}

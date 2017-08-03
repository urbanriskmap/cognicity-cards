import {noView, inject} from 'aurelia-framework';
import {Config} from 'resources/config';

//start-aurelia-decorators
@noView
@inject(Config)
//end-aurelia-decorators
export class Utility {
  constructor(Config) {
    this.config = Config;
  }

  checkUniqueId() {
    var self = this;
    // Escape test in dev & local environment for 'test123'
    //_______is Prod____________otl:test123_______
    if (!self.config.test_card || self.id !== 'test123') {
      //Navigate to location card OR error card, then resize card height to fill screen
      client.get(self.data_src + 'cards/' + self.id)
      .then(response => {
         var msg = JSON.parse(response.response);
         if (msg.result.received === true) {
           // card already exists
          self.reportcard.errors.text = self.locale.card_error_messages.already_received;
          self.router.navigate('error', {replace: true});
          //self.checkBrowserThenResize();
        } else {
          // populate network property of reportcard, accessed in thanks card
          self.reportcard.network = msg.result.network;
          // proceed to first card
          self.router.navigate(self.router.routes[1].route, {replace: true});
          //self.checkBrowserThenResize();
        }
      })
      .catch(response => {
        if (response.statusCode === 404) {
          // error this card does not exist
          self.reportcard.errors.code = response.statusCode;
          self.reportcard.errors.text = self.locale.card_error_messages.unknown_link;
          self.router.navigate('error', {replace: true});
          //self.checkBrowserThenResize();
        } else {
          // unhandled error
          self.reportcard.errors.code = response.statusCode;
          self.reportcard.errors.text = self.locale.card_error_messages.unknown_error + " (" + response.statusText + ")";
          self.router.navigate('error', {replace: true});
          //self.checkBrowserThenResize();
        }
      });
    } else {
      // proceed to first card
      self.router.navigate(self.router.routes[1].route, {replace: true});
      //self.checkBrowserThenResize();
    }
  }
}

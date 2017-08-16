import {noView, inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import {ReportCard} from 'utility/report-card';

//start-aurelia-decorators
@noView
@inject(ReportCard)
//end-aurelia-decorators
export class AuthService {
  constructor(ReportCard) {
    this.reportcard = ReportCard;
  }

  checkUniqueId(unique_id, next, router) {
    var self = this;
    // Escape {id: 'test123'} in dev & local environments
    if (self.reportcard.config.enable_test_cardid && unique_id === 'test123') {
      return next();
    } else {
      console.log('Test id disabled, contacting data server');
      return new Promise((resolve, reject) => {
        let client = new HttpClient();
        // prod environment
        client.get(self.data_src + 'cards/' + unique_id)
        .then(response => {
          console.log('Received response from server');
          console.log(response);
           var msg = JSON.parse(response.response);
           if (msg.result.received === true) {
            // card already exists
            console.log('Report exists for id');
            self.reportcard.errors.text = self.reportcard.locale.card_error_messages.already_received;
            resolve(next.cancel(router.navigateToRoute('error')));
          } else {
            // populate network property of reportcard, accessed in thanks card
            self.reportcard.network = msg.result.network;
            // proceed to first card
            console.log('Proceeding to first card');
            resolve(next());
          }
        }).catch(response => {
          if (response.statusCode === 404) {
            // error this card does not exist
            console.log('Invalid card id');
            self.reportcard.errors.code = response.statusCode;
            self.reportcard.errors.text = self.locale.card_error_messages.unknown_link;
            resolve(next.cancel(router.navigateToRoute('error')));
          } else {
            // unhandled error
            console.log('Unknown error');
            self.reportcard.errors.code = response.statusCode;
            self.reportcard.errors.text = self.locale.card_error_messages.unknown_error + " (" + response.statusText + ")";
            resolve(next.cancel(router.navigateToRoute('error')));
          }
        });
      });
    }
  }
}

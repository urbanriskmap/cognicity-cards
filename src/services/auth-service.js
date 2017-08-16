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
      return new Promise((resolve, reject) => {
        let client = new HttpClient();
        // prod environment
        client.get(self.reportcard.config.data_server + 'cards/' + unique_id)
        .then(response => {
         var msg = JSON.parse(response.response);
         if (msg.result.received === true) {
          // card already exists
          //TODO: store data in route settings instead of reportcard singleton
          self.reportcard.errors.text = self.reportcard.locale.card_error_messages.already_received;
          resolve(next.cancel(router.navigateToRoute('error')));
          } else {
            // populate network property of reportcard, accessed in thanks card
            self.reportcard.network = msg.result.network;
            // proceed to first card
            resolve(next());
          }
        }).catch(response => {
          if (response.statusCode === 404) {
            // error this card does not exist
            //TODO: store data in route settings instead of reportcard singleton
            self.reportcard.errors.code = response.statusCode;
            self.reportcard.errors.text = self.reportcard.locale.card_error_messages.unknown_link;
            resolve(next.cancel(router.navigateToRoute('error')));
          } else {
            // unhandled error
            //TODO: store data in route settings instead of reportcard singleton
            self.reportcard.errors.code = response.statusCode;
            self.reportcard.errors.text = self.reportcard.locale.card_error_messages.unknown_error + " (" + response.statusText + ")";
            resolve(next.cancel(router.navigateToRoute('error')));
          }
        });
      });
    }
  }
}

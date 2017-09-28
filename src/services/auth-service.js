/**
  * @fileOverview Authorisation service for validating one time link
*/
import {noView, inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import {ReportCard} from 'utility/report-card';

//start-aurelia-decorators
@noView
@inject(ReportCard)
//end-aurelia-decorators
export class AuthService {
  /**
    * Aurelia class constructor
    * @constructs AuthService
    * @param {ReportCard} ReportCard - Inject ReportCard singleton.
  */
  constructor(ReportCard) {
    this.reportcard = ReportCard;
  }

  /**
    * Checks if the one time link provided in the browser url exists in the database
        and returns appropriate navigation event
    * @param {string} unique_id - One time link or card id.
    * @param {function} next - Aurelia router PreActivateStep prototype. Executing next
        enables the router to continue navigation.
    * @param {Router} router - Aurelia router as configured in App class.
    * @returns {function} Navigation event, using next() to proceed to first card in deck,
        or next.cancel() to redirect to the error page
  */
  checkUniqueId(unique_id, next, router) {
    var self = this;
    var error_settings;
    for (let route of router.routes) {
      if (route.name === 'error') {
        error_settings = route.settings;
      }
    }
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
          error_settings.msg = self.reportcard.locale.card_error_messages.already_received;
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
            error_settings.code = response.statusCode;
            error_settings.msg = self.reportcard.locale.card_error_messages.unknown_link;
            resolve(next.cancel(router.navigateToRoute('error')));
          } else {
            // unhandled error
            error_settings.code = response.statusCode;
            error_settings.msg = self.reportcard.locale.card_error_messages.unknown_error + " (" + response.statusText + ")";
            resolve(next.cancel(router.navigateToRoute('error')));
          }
        });
      });
    }
  }
}

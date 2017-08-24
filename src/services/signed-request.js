import {noView, inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import {ReportCard} from 'utility/report-card';

//start-aurelia-decorators
@noView
@inject(ReportCard)
//end-aurelia-decorators
export class SignedRequest {
  constructor(ReportCard) {
    this.id = ReportCard.id;
    this.data_server = ReportCard.config.data_server;
  }

  getSignedURL(type) {
    var self = this;

    return new Promise(function(resolve, reject) {
      let client = new HttpClient()
      .configure(x => {
        x.withBaseUrl(self.data_server + 'cards/' + self.id);
        x.withHeader('Content-Type', type);
      });

      client.get('/images')
      .then(response => {
        let msg = JSON.parse(response.response);
        let signedURL = msg.signedRequest;
        resolve(signedURL);
      }).catch(error => {
        reject(error);
      });
    });
  }
}

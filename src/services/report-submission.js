import {noView, inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import {ReportCard} from 'utility/report-card';

//start-aurelia-decorators
@noView
@inject(ReportCard)
//end-aurelia-decorators
export class ReportSubmission {
  constructor(ReportCard) {
    this.reportcard = ReportCard;
    this.data_server = ReportCard.config.data_server;
  }

  putReport(report, id, router, hasPhoto, photoUploaded) {
    var self = this;

    // Define route settings pointers
    var error_settings, thanks_settings;
    for (let route of router.routes) {
      if (route.name === 'error') {
        error_settings = route.settings;
      }
      if (route.name === 'thanks') {
        thanks_settings = route.settings;
      }
    }

    // Construct http client
    let client_report = new HttpClient()
    .configure(x => {
      x.withBaseUrl(self.data_server + 'cards/');
    });

    // PUT reportcard data
    client_report.put(id, report)
    .then(put_success => {
      if (hasPhoto && photoUploaded) {
        // If photo uploaded successfully, patch image_url
        client_report.patch(id, {
          // TODO: match server patch handler
          image_url: id
        }).then(patch_success => {
          // Proceed to thanks page
          thanks_settings.code = 'pass';
          router.navigate('thanks');
        }).catch(patch_error => {
          // Proceed to thanks page with image upload error notification
          thanks_settings.code = 'fail';
          router.navigate('thanks');
        });
      } else if (hasPhoto && !photoUploaded) {
        // Proceed to thanks page with image upload error notification
        thanks_settings.code = 'fail';
        router.navigate('thanks');
      } else {
        // Proceed to thanks page
        thanks_settings.code = 'pass';
        router.navigate('thanks');
      }
    }).catch(put_error => {
      // Navigate to error page if PUT reportcard data fails
      error_settings.code = put_error.statusCode;
      error_settings.msg = put_error.statusText;
      router.navigate('error');
    });
  }

  submitReport(report, id, router) {
    var self = this;
    var photo = self.reportcard.photo.file[0];
    var signedURL = self.reportcard.photo.signedURL;

    if (photo && signedURL) {
      let client_photo = new HttpClient();

      if (signedURL === 'url_error') {
        // PUT report & notify user about upload error
        this.putReport(report, id, router, true, false);
      } else {
        // PUT photo in S3 bucket using signedURL
        client_photo.put(signedURL, photo)
        .then(success => {
          // PUT report & patch image_url
          this.putReport(report, id, router, true, true);
        }).catch(error => {
          // PUT report & notify user about upload error
          this.putReport(report, id, router, true, false);
        });
      }
    } else {
      // PUT report & proceed to thanks
      this.putReport(report, id, router, false, false);
    }
  }
}

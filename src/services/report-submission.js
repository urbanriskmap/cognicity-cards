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

  submitReport(report, photo, id, router) {
    var self = this;
    var error_settings, thanks_settings;
    for (let route of router.routes) {
      if (route.name === 'error') {
        error_settings = route.settings;
      }
      if (route.name === 'thanks') {
        thanks_settings = route.settings;
      }
    }

    let client_data = new HttpClient();
    client_data.put(self.data_server + 'cards/' + id, report)
    .then(response_data => {
      // now upload photo
      if (photo) {
        let client_photo = new HttpClient()
        .configure(x => {
          x.withBaseUrl(self.data_server + 'cards/' + id);
          x.withHeader('Content-Type', photo[0].type);
        });

        //Get AWS signed url
        client_photo.get('/images')
        .then(response_photo => {
          let msg = JSON.parse(response_photo.response);
          let signedURL = msg.signedRequest;
          //Post image to signed url
          $.ajax({
            url: signedURL,
            type: 'PUT',
            data: photo[0],
            contentType: false,
            processData: false,
            cache: false,
            error: function (data) {
              //TODO: store data in route settings instead of reportcard singleton
              thanks_settings.code = 'fail';
              console.log("Error uploading image to AWS");
            },
            success: function () {
              console.log("Uploaded image to AWS successfully!");
              // Proceed to thanks page if report submit resolved & image uploaded;
              thanks_settings.code = 'pass';
              router.navigate('thanks');
            }
          });
        }).catch(error_photo => {
          //TODO: store data in route settings instead of reportcard singleton
          console.log('error_photo');
        });
      } else {
        // Proceed to thanks page if report submit resolved, and no photo to upload;
        thanks_settings.code = 'pass';
        router.navigate('thanks');
      }
    }).catch(error_data => {
      error_settings.code = error_data.statusCode;
      error_settings.msg = error_data.statusText;
      router.navigate('error');
    });
  }
}

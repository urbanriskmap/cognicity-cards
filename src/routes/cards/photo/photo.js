import {inject} from 'aurelia-framework';
import $ from 'jquery';
import {ReportCard} from 'utility/report-card';
import {ImageUtility} from 'utility/image-utility';
import {EventAggregator} from 'aurelia-event-aggregator';
import {SignedRequest} from 'services/signed-request';

//start-aurelia-decorators
@inject(ReportCard, EventAggregator, ImageUtility, SignedRequest)
//end-aurelia-decorators
export class Photo {
  constructor(ReportCard, EventAggregator, ImageUtility, SignedRequest) {
    this.reportcard = ReportCard;
    this.img_utility = ImageUtility;
    this.ea = EventAggregator;
    this.signed_request = SignedRequest;
    if (this.reportcard.photo.file) {
      this.haveImg = true;
    }
    this.enableUpload = true;
  }

  uploadSupported() {
    var nua = navigator.userAgent.toLowerCase();
    var version;
    if ((nua.indexOf('android') >= 0) && (nua.indexOf('chrome') === -1)) { //android device, no chrome (add opera? etc.)
      var rest = nua.substring(nua.indexOf('android') + 8, nua.length);
      version = rest.substring(0, 3); //2-digit android version
      return (parseFloat(version) >= 4.4);
    } else {
      return true;
    }
  }

  attached() {
    if (this.uploadSupported()) {
      this.cntxt = this.preview.getContext('2d');
      $('#previewWrapper').addClass('enabled');
    } else {
      this.ea.publish('upload', 'error');
      this.enableUpload = false;
    }
    if (this.haveImg) {
      this.img_utility.drawImage(this.reportcard.photo.rotation, this.preview, 'canvas', this.reportcard.photo.file[0])
      .then(() => {
        $('#rotateButton').prop("disabled", false);
        $('#deleteButton').prop("disabled", false);
      });
    }
  }

  sendClick() {
    $('#ghostButton').trigger('click');
    this.notify = false;
  }

  sizeCheck() {
    if (this.reportcard.photo.file[0]) {
      if (this.reportcard.photo.file[0].size < 8388608) {
        this.img_utility.drawImage(0, this.preview, 'canvas', this.reportcard.photo.file[0])
        .then(() => {
          $('#rotateButton').prop("disabled", false);
          $('#deleteButton').prop("disabled", false);

          // get signedURL & store in reportcard
          this.signed_request.getSignedURL(this.reportcard.id, this.reportcard.photo.file[0].type)
          .then(signedURL => {
            this.reportcard.photo.signedURL = signedURL;
          }).catch(error => {
            this.reportcard.photo.signedURL = 'url_error';
          });
        });
      } else {
        this.ea.publish('size', 'error');
        this.reportcard.photo.file = null;
      }
    }
  }

  rotatePhoto() {
    this.reportcard.photo.rotation += 90;
    this.img_utility.drawImage(this.reportcard.photo.rotation, this.preview, 'canvas', this.reportcard.photo.file[0])
    .then(() => {
      $('#rotateButton').prop("disabled", false);
      $('#deleteButton').prop("disabled", false);
    });
  }

  deletePhoto() {
    this.cntxt.translate(-this.preview.width / 2, -this.preview.height / 2);
    this.cntxt.clearRect(0, 0, this.preview.width, this.preview.height);

    this.reportcard.photo = {file: null, rotation: 0, signedURL: null};

    $('#rotateButton').prop("disabled", true);
    $('#deleteButton').prop("disabled", true);
  }
}

import {inject} from 'aurelia-framework';
import $ from 'jquery';
import {ReportCard} from 'utility/report-card';
import {ImageUtility} from 'utility/image-utility';
import {EventAggregator} from 'aurelia-event-aggregator';

//start-aurelia-decorators
@inject(ReportCard, EventAggregator, ImageUtility)
//end-aurelia-decorators
export class Photo {
  constructor(ReportCard, EventAggregator, ImageUtility) {
    this.reportcard = ReportCard;
    this.imgutility = ImageUtility;
    this.ea = EventAggregator;
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
      this.imgutility.drawImage(this.reportcard.photo.rotation, this.preview, 'canvas', this.reportcard.photo.file[0])
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
      if (this.reportcard.photo.file[0].size < 4404019) {
        this.imgutility.drawImage(0, this.preview, 'canvas', this.reportcard.photo.file[0])
        .then(() => {
          $('#rotateButton').prop("disabled", false);
          $('#deleteButton').prop("disabled", false);
        });
      } else {
        this.ea.publish('size', 'error');
        this.reportcard.photo.file = null;
      }
    }
  }

  rotatePhoto() {
    this.reportcard.photo.rotation += 90;
    this.imgutility.drawImage(this.reportcard.photo.rotation, this.preview, 'canvas', this.reportcard.photo.file[0])
    .then(() => {
      $('#rotateButton').prop("disabled", false);
      $('#deleteButton').prop("disabled", false);
    });
  }

  deletePhoto() {
    this.cntxt.translate(-this.preview.width / 2, -this.preview.height / 2);
    this.cntxt.clearRect(0, 0, this.preview.width, this.preview.height);
    this.reportcard.photo.file = null;
    $('#rotateButton').prop("disabled", true);
    $('#deleteButton').prop("disabled", true);
    this.reportcard.photo.rotation = 0;
  }
}

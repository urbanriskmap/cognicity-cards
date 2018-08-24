import {noView, inject} from 'aurelia-framework';
import {Config} from 'resources/config';

//start-aurelia-decorators
@noView
@inject(Config)
//end-aurelia-decorators
export class Utility {
  constructor(Config) {
    this.config = Config;
    this.region_bounds = {};
    for (let city in Config.map.instance_regions) {
      this.region_bounds[city] = Config.map.instance_regions[city].bounds;
    }
  }

  setCardData(router) {
    var count;
    for (let i in router.routes) {
      if (router.routes[i].name === router.currentInstruction.fragment) {
        count = i;
      }
    }
    this.total_cards = router.routes.length - 2;
    this.card_count = parseInt(count);
  }

  resizeCardHt(factor) {
    //var glitchHeight = 106;
    var glitchHeight = 0;
    $(document.body).css({
      'height': $(document).height() - (factor * glitchHeight) + 'px'
    });
    $('.card_content_wrapper').css({
      'height': $(document).height() - ($('.card_title_wrapper').height() + (factor * glitchHeight)) + 'px'
    });
    $('.card_navigation_wrapper').css({
      'bottom': (factor * glitchHeight) + 'px'
    });
  }

  checkBrowserThenResize() {
    //Fit 'n' tab buttons on-the-fly, n = (all child-routes) - ([0] redirect route) - ('terms' route)
    $('.tabButtons').width((100 / this.total_cards) + '%');

    var nua = navigator.userAgent.toLowerCase();
    //___________________________is Mobile______________________an iPhone___________
    this.isIphone = ((/Mobi/.test(navigator.userAgent)) && nua.indexOf('iphone') > -1);
    //____________________browser not safari (in-app)___________app is twitter________________app is facebook________________ facebook messenger_________
    if (this.isIphone && nua.indexOf('safari') === -1 && (nua.indexOf('twitter') > -1 || (nua.indexOf('fban') > -1 && nua.indexOf('messenger') > -1))) {
      this.resizeCardHt(1);
    } else {
      //Execute resize on initial page load
      this.resizeCardHt(0);
    }
  }

  disableNext(router, reportcard) {
    const thisRoute = router.currentInstruction.fragment;
    if (thisRoute === 'location') {
      //disable next if gps error and location not selected
      return !reportcard.location.markerLocation;
    } else if (thisRoute === 'prep') {
      //disable next if prep type not selected
      return !reportcard.reportType;
    } else if (thisRoute === 'depth') {
      //disable next if depth slider not dragged
      return !this.sliderDragged;
    } else if (
      thisRoute === 'roof'
      || thisRoute === 'nonstructural'
      || thisRoute === 'walls'
      || thisRoute === 'plinth'
    ) {
      return !reportcard.damages[thisRoute];
    } else {
      //disable next for review, terms cards
      return this.card_count >= this.total_cards;
    }
  }

  isLocationSupported(reportcard) {
    var self = this;
    var l = reportcard.location.markerLocation;
    reportcard.location.supported = false;

    for (let city in self.region_bounds) {
      if (l.lat > self.region_bounds[city].sw[0] && l.lng > self.region_bounds[city].sw[1] && l.lat < self.region_bounds[city].ne[0] && l.lng < self.region_bounds[city].ne[1]) {
        reportcard.location.supported = true;
        break;
      }
    }
    return reportcard.location.supported;
  }

  navigate(order, router, reportcard) {
    var self = this;
    if (order === 'next') {
      if (router.currentInstruction.fragment === 'location') {
        if (self.isLocationSupported(reportcard) || self.location_check) {
          self.card_count += 1;
          router.navigate(router.routes[self.card_count].route);
          self.closeNotification();
        }
        if (!self.location_check && !self.isLocationSupported(reportcard)) {
          self.showNotification('warning', 'location_2', 'location_2', false);
          self.location_check = true; // execute showNotification once
        }
      } else if (router.currentInstruction.fragment !== 'location' && self.card_count < self.total_cards) {
        self.card_count += 1;
        router.navigate(router.routes[self.card_count].route);
        self.closeNotification();
      }
    } else if (order === 'prev') {
      if (self.card_count > 1) {
        if (router.currentInstruction.fragment !== 'terms') {
          self.card_count -= 1;
        }
        router.navigate(router.routes[self.card_count].route);
      }
    }
  }

  showNotification(type, header, message, bespoke) {
    var self = this;
    self.notify_type = type;
    self.notify_header = header;
    self.notify_message = message;
    if (bespoke) {
      self.notify_custom = true;
    } else {
      self.notify_custom = false;
    }
    if ($('#notifyWrapper').hasClass('active')) {
      $('#notifyWrapper').finish();
    }
    $('#notifyWrapper').slideDown(300, () => {
      $('#notifyWrapper').addClass('active');
    }).delay(5000).slideUp(300, () => {
      $('#notifyWrapper').removeClass('active');
    });
  }

  closeNotification() {
    if ($('#notifyWrapper').hasClass('active')) {
      $('#notifyWrapper').dequeue();
    }
  }
}

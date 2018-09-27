import {inject, computedFrom} from 'aurelia-framework';
import {Utility} from 'utility/utility';
import {ReportCard} from 'utility/report-card';
import {EventAggregator} from 'aurelia-event-aggregator';

//start-aurelia-decorators
@inject(Utility, ReportCard, EventAggregator)
//end-aurelia-decorators
export class RouteHandler {
  constructor(Utility, ReportCard, EventAggregator) {
    this.utility = Utility;
    this.reportcard = ReportCard;
    this.ea = EventAggregator;
    this.router_map = JSON.parse('card-routes-in-supported-deck');
  }

  configureRouter(config, router) {
    config.options.pushState = true;
    config.map(this.router_map);
    this.router = router;
  }

  attached() {
    var self = this;

    //Store total number of cards, current card number
    self.utility.setCardData(self.router);

    //Resize child router container
    self.utility.checkBrowserThenResize();

    //Add resize listener to browser window
    $(window).resize(() => {
      self.utility.checkBrowserThenResize();
    });

    // facebook blue screen for iphones to redirect to safari
    // if (self.utility.isIphone && self.reportcard.network === 'facebook') {
    //   $('#redirect_screen').fadeIn(600).delay(3000).fadeOut(600);
    // }


    //Event listener for navigating to terms card
    self.ea.subscribe('readTerms', msg => {
      self.router.navigate('terms');
    });

    //Event subscription required if deck includes location card
    self.ea.subscribe('geolocate', error => {
      self.utility.showNotification(error, 'location_1', 'location_1', false);
    });

    //Event subscription required if deck includes photo card
    self.ea.subscribe('upload', error => {
      self.utility.showNotification(error, 'photo_2', 'photo_2', false);
    });
    self.ea.subscribe('size', error => {
      self.utility.showNotification(error, 'photo_1', 'photo_1', false);
    });

    //Event subscription required if deck includes depth card
    self.ea.subscribe('depthSlider', msg => {
      self.utility.sliderDragged = true;
    });
  }

  //use computedFrom decorator to prevent dirty checking, instead observe changes
  //in values of specified parameters as dependents for the function
  //start-aurelia-decorators
  @computedFrom(
    'router.currentInstruction.fragment',
    'reportcard.reportType',
    'utility.sliderDragged',
    'reportcard.location.markerLocation',
    'reportcard.damages.nonstructural',
    'reportcard.damages.roof',
    'reportcard.damages.walls',
    'reportcard.damages.plinth'
  )
  //end-aurelia-decorators
  get isNextDisabled() {
    return this.utility.disableNext(this.router, this.reportcard);
  }
}

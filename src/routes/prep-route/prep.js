import {inject, computedFrom} from 'aurelia-framework';
import {Utility} from 'utility/utility';
import {ReportCard} from 'utility/report-card';
import {EventAggregator} from 'aurelia-event-aggregator';

//start-aurelia-decorators
@inject(Utility, ReportCard, EventAggregator)
//end-aurelia-decorators
export class Flood {
  //aurelia component initialization
  constructor(Utility, ReportCard, EventAggregator) {
    this.utility = Utility;
    this.reportcard = ReportCard;
    this.ea = EventAggregator;
  }

  configureRouter(config, router) {
    config.options.pushState = true;
    config.map([
      {route: '', redirect: 'prep'},
      {route: 'prep',             name: 'prep',          moduleId: '../cards/prep/prep'},
      {route: 'location',         name: 'location',      moduleId: '../cards/location/location'},
      {route: 'photo',            name: 'photo',         moduleId: '../cards/photo/photo'},
      {route: 'description',      name: 'description',   moduleId: '../cards/description/description'},
      {route: 'review',           name: 'review',        moduleId: '../cards/review/review'},
      {route: 'terms',            name: 'terms',         moduleId: '../cards/terms/terms'}
    ]);
    this.router = router;
    this.total_cards = this.router.routes.length - 1;
  }

  //aurelia component attached to DOM hook
  attached() {
    var self = this;
    self.utility.setCardData(self.router)
    .then((total, count) => {
      self.utility.total_cards = total;
      self.utility.card_count = count;
    });

    //Resize child router container
    self.utility.checkBrowserThenResize();

    //Add resize listener to browser window
    $(window).resize(() => {
      self.utility.checkBrowserThenResize();
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
  }

  //use computedFrom decorator to prevent dirty checking, instead observe changes
  //in values of specified parameters as dependents for the function
  //start-aurelia-decorators
  @computedFrom('router.currentInstruction.fragment', 'reportcard.reportType', 'utility.sliderDragged', 'reportcard.location.markerLocation')
  //end-aurelia-decorators
  get isNextDisabled() {
    return this.utility.disableNext(this.router, this.reportcard);
  }
}

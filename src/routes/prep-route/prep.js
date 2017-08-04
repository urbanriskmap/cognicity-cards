import {inject} from 'aurelia-framework';
import {Utility} from 'utility/utility';
import {ReportCard} from 'utility/report-card';

//start-aurelia-decorators
@inject(Utility, ReportCard)
//end-aurelia-decorators
export class Prep {
  constructor(Utility, ReportCard) {
    this.utility = Utility;
    this.reportcard = ReportCard;
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

  activate(params, routerConfig) {
    
  }

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
  }

  get isNextDisabled() {
    return this.utility.disableNext(this.router, this.reportcard);
  }
}

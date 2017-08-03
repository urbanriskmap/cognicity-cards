import {inject} from 'aurelia-framework';
import $ from 'jquery';
import {EventAggregator} from 'aurelia-event-aggregator';
import {HttpClient} from 'aurelia-http-client';
import {Config} from 'resources/config'; // Cards config
import {ReportCard} from 'resources/report-card';

//start-aurelia-decorators
@inject(EventAggregator, ReportCard, Config)
//end-aurelia-decorators
export class App {
  constructor(EventAggregator, ReportCard, Config) {
    this.ea = EventAggregator;
    this.reportcard = ReportCard;
    this.config = Config;
    this.locale = this.reportcard.locale;
    this.data_src = Config.data_server;
    this.test_card = Config.enable_test_cardid;
    this.region_bounds = {};
    for (let city in Config.map.instance_regions) {
      this.region_bounds[city] = Config.map.instance_regions[city].bounds;
    }
  }

  configureRouter(config, router) {
    config.title = this.config.title;
    config.options.pushState = true;
    config.options.root = '/';
    config.addPreRenderStep(PreRenderStep);

    config.map([
      {route: ':id/flood', moduleId: 'routes/flood/flood'},
      {route: ':id/prep', moduleId: 'routes/prep/prep'}
    ]);
    config.mapUnknownRoutes({moduleId: 'routes/error/error'}); //TODO: external routes - to map landing
    this.router = router;
  }

  activate(params) {
    console.log(params.id);
  }
}

export class PreRenderStep {
  run(navigationInstruction, Next) {
    this.next = Next;
    console.log('Inside pre render');

    return new Promise((resolve, reject) => {
      resolve(this.next());
    });
  }
}

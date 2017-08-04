import {inject} from 'aurelia-framework';
import {RedirectToRoute} from 'aurelia-router';
import $ from 'jquery';
import {EventAggregator} from 'aurelia-event-aggregator';
import {HttpClient} from 'aurelia-http-client';
import {Config} from 'resources/config'; // Cards config
import {AuthService} from 'services/auth-service';

//start-aurelia-decorators
@inject(EventAggregator, Config)
//end-aurelia-decorators
export class App {
  constructor(EventAggregator, Config) {
    this.ea = EventAggregator;
    this.config = Config;
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
      {route: 'flood/:id', moduleId: 'routes/flood-route/flood'},
      {route: 'prep/:id', moduleId: 'routes/prep-route/prep'},
      {route: 'error', name: 'error', moduleId: 'routes/error/error'}
    ]);
    config.mapUnknownRoutes({redirect: 'error'}); //TODO: external routes - to map landing
    this.router = router;
  }
}

//start-aurelia-decorators
@inject(AuthService)
//end-aurelia-decorators
export class PreRenderStep {
  constructor(AuthService) {
    this.service = AuthService;
  }
  run(navigationInstruction, next) {
    var self = this;
    self.router = navigationInstruction.router;
    self.id = navigationInstruction.params.id;
    if (navigationInstruction.fragment === '/error') {
      return next();
    } else {
      return self.service.checkUniqueId(self.id, next, self.router);
    }
  }
}

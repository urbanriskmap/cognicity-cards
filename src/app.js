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
    config.addPreActivateStep(PreActivateStep);

    //TODO: fill handler routes by processDisasterRoutes task
    config.map([
      {route: 'flood/:id',  name: 'flood',    moduleId: 'routes/_route_handlers/flood-route/flood'},
      {route: 'prep/:id',   name: 'prep',     moduleId: 'routes/_route_handlers/prep-route/prep'},
      {route: 'error',      name: 'error',    moduleId: 'routes/error/error'}
    ]);

    config.mapUnknownRoutes({redirect: 'error'}); //TODO: external routes - to map landing
    this.router = router;
  }
}

//start-aurelia-decorators
@inject(AuthService, Config)
//end-aurelia-decorators
export class PreActivateStep {
  constructor(AuthService, Config) {
    this.service = AuthService;
    this.config = Config;
  }
  run(navigationInstruction, next) {
    var self = this;
    var router = navigationInstruction.router;
    var id = navigationInstruction.params.id;

    var fragment = navigationInstruction.config.navModel.relativeHref.split('/')[0];
    var disaster_type = (fragment in self.config.supported_card_decks) ? fragment : null;

    var first_card_route = self.config.supported_card_decks[disaster_type][0];

    //TODO: store error messages in config, call from error route's view-model
    if (navigationInstruction.fragment === '/error' || navigationInstruction.fragment === '/thanks') {
      //If navigating to error or thanks page, proceed
      return next();
    } else if (!disaster_type) {
      //If disaster type is incorrect, navigate to error page
      return next.cancel(router.navigateToRoute('error'));
    } else if (!self.config.id) {
      //If :id authorization is pending
      if (navigationInstruction.config.hasChildRouter && (navigationInstruction.params.childRoute !== first_card_route)) {
        //If navigating to child route (card) other than first card in deck, redirect
        return next.cancel(router.navigate(disaster_type + '/' + id));
      } else {
        //Store config params
        self.config.disaster_type = disaster_type;
        self.config.id = id;
        //Call server to check if :id is valid, then proceed to first card in deck
        return self.service.checkUniqueId(id, next, router);
      }
    } else {
      //Disaster type supported, id authorization successful, navigating using prev/next buttons
      return next();
    }
  }
}

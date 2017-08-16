import {inject} from 'aurelia-framework';
import $ from 'jquery';
import {EventAggregator} from 'aurelia-event-aggregator';
import {HttpClient} from 'aurelia-http-client';
import {Config} from 'resources/config';
import {ReportCard} from 'utility/report-card';
import {AuthService} from 'services/auth-service';
import {ReportSubmission} from 'services/report-submission';

//start-aurelia-decorators
@inject(EventAggregator, Config, ReportSubmission)
//end-aurelia-decorators
export class App {
  constructor(EventAggregator, Config, ReportSubmission) {
    this.ea = EventAggregator;
    this.config = Config;
    this.submission = ReportSubmission;
    this.region_bounds = {};
    for (let city in Config.map.instance_regions) {
      this.region_bounds[city] = Config.map.instance_regions[city].bounds;
    }
    //TODO: fill handler routes by processDisasterRoutes task
    this.router_map = [
      {route: 'flood/:id',  name: 'flood',    moduleId: 'routes/_route_handlers/flood-route/flood'},
      {route: 'prep/:id',   name: 'prep',     moduleId: 'routes/_route_handlers/prep-route/prep'},
      {route: 'error',      name: 'error',    moduleId: 'routes/error/error'},
      {route: 'thanks',     name: 'thanks',   moduleId: 'routes/thanks/thanks'}
    ];
  }
  configureRouter(config, router) {
    config.title = this.config.title;
    config.options.pushState = true;
    config.options.root = '/';
    config.addPreActivateStep(PreActivateStep);
    config.map(this.router_map);
    config.mapUnknownRoutes({redirect: 'error'}); //TODO: external routes - to map landing
    this.router = router;
  }
  attached() {
    var self = this;
    self.ea.subscribe('submit', msg => {
      self.submission.submitReport(msg.report, msg.photo, msg.id, self.router);
    });
  }
}

//start-aurelia-decorators
@inject(AuthService, Config, ReportCard)
//end-aurelia-decorators
export class PreActivateStep {
  constructor(AuthService, Config, ReportCard) {
    this.service = AuthService;
    this.config = Config;
    this.reportcard = ReportCard;
    console.log('Inside PreActivateStep');
  }
  run(navigationInstruction, next) {
    var self = this;
    var router = navigationInstruction.router;
    var id = navigationInstruction.params.id;
    var fragment = navigationInstruction.config.navModel.relativeHref.split('/')[0];
    var disaster_type = (fragment in self.config.supported_card_decks) ? fragment : null;

    if (navigationInstruction.fragment === '/error' || navigationInstruction.fragment === '/thanks') {
      //TODO: store error messages in config, call from error route's view-model
      //If navigating to error or thanks page, proceed
      return next();
    } else if (!disaster_type) {
      //If disaster type is incorrect, navigate to error page
      return next.cancel(router.navigateToRoute('error'));
    } else if (!self.reportcard.id) {
      var first_card_route = self.config.supported_card_decks[disaster_type][0];
      //If :id authorization is pending
      if (navigationInstruction.config.hasChildRouter && (navigationInstruction.params.childRoute !== first_card_route)) {
        //If navigating to child route (card) other than first card in deck, redirect
        return next.cancel(router.navigate(disaster_type + '/' + id));
      } else {
        //Store config params
        self.reportcard.disaster_type = disaster_type;
        //TODO: id not getting passed???
        self.reportcard.id = id;
        //Call server to check if :id is valid, then proceed to first card in deck
        return self.service.checkUniqueId(id, next, router);
      }
    } else {
      //Disaster type supported, id authorization successful, navigating using prev/next buttons
      return next();
    }
  }
}

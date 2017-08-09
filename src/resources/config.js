import env from 'environment';
import dep from 'deployment';
import {noView} from 'aurelia-framework';

//start-aurelia-decorators
@noView
//end-aurelia-decorators
export class Config {
  constructor() {
    this.title = env[dep.name].title;
    this.data_server = env[dep.name].data_server;
    this.tile_layer = env[dep.name].tile_layer;
    this.enable_test_cardid = env.enable_test_cardid;
    this.map = dep.map;
    this.supported_languages = env[dep.name].supported_languages;
    this.default_language = env[dep.name].default_language;
    this.supported_card_decks = dep.supported_card_decks;
  }
}

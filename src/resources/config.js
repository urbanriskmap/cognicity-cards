import env from 'environment';
import dep from 'deployment';
import {noView} from 'aurelia-framework';

//start-aurelia-decorators
@noView
//end-aurelia-decorators
export class Config {
  constructor() {
    this.title = env[dep.name].title;
    this.height_units = dep.height_units;
    this.data_server = env[dep.name].data_server;
    this.tile_layer = env[dep.name].tile_layer;
    this.map_page = env[dep.name].app;
    this.enable_test_cardid = env.enable_test_cardid;
    this.map = dep.map;
    this.supported_languages = dep.supported_languages;
    for (let lang of this.supported_languages) {
      if (lang.key === env[dep.name].default_language) {
        this.default_language = lang;
      }
    }
    this.supported_card_decks = dep.supported_card_decks;
  }
}

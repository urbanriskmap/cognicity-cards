import {Config} from 'resources/config';
import {noView, inject} from 'aurelia-framework';
import {Locales} from 'resources/locales/locales';

//start-aurelia-decorators
@noView
@inject(Locales, Config)
//end-aurelia-decorators
export class ReportCard {
  static metadata() {
    return Metadata.singleton(true);
  } //true indicates to register in the root container

  // Support language changing
  changeLanguage() {
    this.locale = this.lang_obj[this.selLanguage.key];
  }

  constructor(Locales, Config) {
    var self = this;
    self.config = Config;
    self.selLanguage = Config.default_language;
    self.languages = Config.supported_languages;
    self.lang_obj = {};
    for (let lang of self.languages) {
      if (Locales.languages.hasOwnProperty(lang.key)) {
        self.lang_obj[lang.key] = Locales.languages[lang.key];
      }
    }
    self.locale = {};
    self.changeLanguage(self.selLanguage);

    self.disaster_type = null;
    self.location = {markerLocation: null, gpsLocation: null, accuracy: null, supported: false};
    self.depth = null; //TODO: make this object similar to DB structure, i.e. tags: {flood_depth: 50, report_type: 'treeclearing'.... etc}
    self.reportType = null;
    self.photo = {file: null, rotation: 0, signedURL: null};
    self.description = {value: null};
    self.network = null;
    self.errors = {code: null, text: null};
  }
}

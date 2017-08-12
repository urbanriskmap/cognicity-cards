import gulp from 'gulp';
import project from '../aurelia.json';
import rename from 'gulp-rename';
import filter from 'gulp-filter';
import replace from 'gulp-replace';
import * as deployments from '../deployments/deployments';
import {CLIOptions} from 'aurelia-cli';

export default function processDisasterRoutes() {
  //Get deployment flag value
  let dep = CLIOptions.getFlagValue('dep', 'dep') ? CLIOptions.getFlagValue('dep', 'dep') : 'pb';

  let decks = [];
  let deck_cards = {};
  for (let deck in deployments[dep].supported_card_decks) {
    //Fill decks with name of each supported_card_deck
    decks.push(deck);

    //Fill deck_cards with router map
    deck_cards[deck] = [{route: '', redirect: deployments[dep].supported_card_decks[deck][0]}];
    for (let card of deployments[dep].supported_card_decks[deck]) {
      deck_cards[deck].push(
        {route: card, name: card, moduleId: '../../cards/' + card + '/' + card}
      );
    }
    deck_cards[deck].push(
      {route: 'terms', name: 'terms', moduleId: '../../cards/terms/terms'}
    );
  }

  let pipeline;
  decks.forEach(deck => {
    pipeline = gulp.src('src/routes/route-landing/*')
    .pipe(replace('RouteHandler', () => {
      return deck.charAt(0).toUpperCase() + deck.slice(1);
    }))
    .pipe(replace('card-routes-in-supported-deck', () => {
      return JSON.stringify(deck_cards[deck]);
    }))
    .pipe(replace('route-handler', () => {
      return deck;
    }))
    .pipe(rename({
      dirname: deck + '-route',
      basename: deck
    }));
  });

  return pipeline.pipe(gulp.dest('src/routes/_route_handlers'));
}

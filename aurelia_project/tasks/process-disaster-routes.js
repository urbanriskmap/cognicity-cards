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

  /*
  //Alternate 1
  var pipeline = gulp.src('src/routes/route-landing/*');
  decks.forEach(deck => {
    pipeline = pipeline
    .pipe(replace('RouteHandler', () => {
      console.log('step 1');
      return deck.charAt(0).toUpperCase() + deck.slice(1);
    }))
    .pipe(replace('card-routes-in-supported-deck', () => {
      console.log('step 2');
      return JSON.stringify(deck_cards[deck]);
    }))
    .pipe(replace('route-handler', () => {
      console.log('step 3');
      return deck;
    }))
    .pipe(rename({
      dirname: deck + '-route',
      basename: deck
    }));
  });
  return pipeline.pipe(gulp.dest('src/routes/_route_handlers'));
  */

  /*
  //Alternate 2
  let pipeline;
  let deck_count = 0;
  decks.forEach(deck => {
    pipeline = gulp.src('src/routes/route-landing/*')
    .pipe(replace('RouteHandler', () => {
      console.log('step 1');
      return deck.charAt(0).toUpperCase() + deck.slice(1);
    }))
    .pipe(replace('card-routes-in-supported-deck', () => {
      console.log('step 2');
      return JSON.stringify(deck_cards[deck]);
    }))
    .pipe(replace('route-handler', () => {
      console.log('step 3');
      return deck;
    }))
    .pipe(rename({
      dirname: deck + '-route',
      basename: deck
    }));

    deck_count += 1;
    if (deck_count === decks.length) {
      return pipeline.pipe(gulp.dest('src/routes/_route_handlers'));
    }
  });
  */

  /*
  //jsFilter.restore || jsFilter(deck).restore, neither work
  var jsFilter = deck => {
    console.log('js'+deck);
    return filter('*.js', {restore: true});
  };
  var htmlFilter = deck => {
    console.log('html'+deck);
    return filter('*.html', {restore: true});
  };
  */

  /*
  //Alternate 3
  decks.forEach(deck => {
    return gulp.src('src/routes/route-landing/*')
    //.pipe(filter(deck+'.js', {restore: true}))
    .pipe(replace('RouteHandler', () => {
      console.log('step 1');
      return deck.charAt(0).toUpperCase() + deck.slice(1);
    }))
    .pipe(replace('card-routes-in-supported-deck', () => {
      console.log('step 2');
      return JSON.stringify(deck_cards[deck]);
    }))
    //.pipe(filter(deck+'.js', {restore: true}).restore)
    //.pipe(filter(deck+'.html', {restore: true}))
    .pipe(replace('route-handler', () => {
      console.log('step 3');
      return deck;
    }))
    //.pipe(filter(deck+'.html', {restore: true}).restore)
    .pipe(rename({
      dirname: deck + '-route',
      basename: deck
    }))
    .pipe(gulp.dest('src/routes/_route_handlers'));
  });
  return pipeline;
  */

  //Alternate 4
  return decks.forEach(deck => {
    gulp.src('src/routes/route-landing/*')
    .pipe(replace('RouteHandler', () => {
      console.log('step 1');
      return deck.charAt(0).toUpperCase() + deck.slice(1);
    }))
    .pipe(replace('card-routes-in-supported-deck', () => {
      console.log('step 2');
      return JSON.stringify(deck_cards[deck]);
    }))
    .pipe(replace('route-handler', () => {
      console.log('step 3');
      return deck;
    }))
    .pipe(rename({
      dirname: deck + '-route',
      basename: deck
    }))
    .pipe(gulp.dest('src/routes/_route_handlers'));
  });
}

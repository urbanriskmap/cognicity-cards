import gulp from 'gulp';
import transpile from './transpile';
//import processDisasterRoutes from './process-disaster-routes';
import processDecks from './process-decks';
import processMarkup from './process-markup';
import processLESS from './process-less';
import processCSS from './process-css';
import {build} from 'aurelia-cli';
import project from '../aurelia.json';

export default gulp.series(
  readProjectConfiguration,
  transpile,
  processDisasterRoutes,
  gulp.parallel(
    processMarkup,
    processLESS,
    processCSS
  ),
  writeBundles
);

function readProjectConfiguration() {
  return build.src(project);
}

function writeBundles() {
  return build.dest();
}

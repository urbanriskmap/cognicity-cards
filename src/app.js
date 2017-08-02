export class App {

  configureRouter(config, router) {
    config.title = 'PetaBencana.id';
    config.options.pushState = true;
    config.options.root = '/';
    config.addPreRenderStep(PreRenderStep);

    config.map([
      {route: 'cards/:id',                                                   moduleId: 'routes/cards/cards'}
    ]);
    config.mapUnknownRoutes({moduleId: 'routes/landing/landing'});
    this.router = router;
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

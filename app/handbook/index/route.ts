import Route from '@ember/routing/route';

export default class HandbookIndexRoute extends Route {
    beforeModel() {
        this.transitionTo('docs');
    }
}

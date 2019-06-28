import Route from '@ember/routing/route';

export default class FormsHelpRoute extends Route.extend({}) {
    model() {
        return this.modelFor('forms');
    }
}

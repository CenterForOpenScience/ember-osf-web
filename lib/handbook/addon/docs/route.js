import Route from '@ember/routing/route';

export default class DocsRoute extends Route {
    model() {
        return this.store.findRecord('project', 'osf-components');
    }
}

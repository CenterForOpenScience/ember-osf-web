import Route from '@ember/routing/route';

export default class extends Route {
    model() {
        return this.store.findRecord('node', 'clst23', { include: 'bibliographic_contributors' });
    }
}

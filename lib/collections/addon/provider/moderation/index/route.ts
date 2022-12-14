import Route from '@ember/routing/route';

export default class ModerationIndex extends Route {
    beforeModel() {
        this.transitionTo('provider.moderation.all');
    }
}

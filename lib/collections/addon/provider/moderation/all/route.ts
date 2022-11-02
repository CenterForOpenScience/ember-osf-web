import Route from '@ember/routing/route';
// import { inject as service } from '@ember/service';

export default class ModerationAll extends Route {
    beforeModel() {
        this.transitionTo('provider.moderation.all.pending');
    }
}

import Route from '@ember/routing/route';

export default class ForksPage extends Route {
    beforeModel() {
        // eslint-disable-next-line no-use-before-define
        const { guid } = (this.modelFor('overview') as { guid: string });
        this.transitionToExternal('guid-registration.forks', guid);
    }
}

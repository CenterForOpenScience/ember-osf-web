import Index from '../../index/route';

export default class ProviderIndex extends Index {
    controllerName = 'index';

    templateName = 'index';

    /**
     * Until this page is implemented, redirect to the discover page.
     */
    beforeModel() {
        this.transitionTo('provider.discover');
    }
}

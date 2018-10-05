import Route from '@ember/routing/route';

export default class Application extends Route.extend({
    beforeModel(transition: any) {
        this._super(transition);

        // If we're not on a provider, redirect
        if (!/^collections\.provider/.test(transition.targetName)) {
            this.transitionToExternal('home');
        }
    },
}) {
}

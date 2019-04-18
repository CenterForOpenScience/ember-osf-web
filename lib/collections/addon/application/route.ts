import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import Theme from 'ember-osf-web/services/theme';

export default class Application extends Route.extend({
    beforeModel(this: Application, transition: any) {
        this._super(transition);

        this.theme.set('providerType', 'collection');

        // If we're not on a provider, redirect
        if (!/^collections\.(provider|page-not-found)/.test(transition.targetName)) {
            return this.transitionToExternal('home');
        }
        return undefined;
    },
}) {
    @service theme!: Theme;
}

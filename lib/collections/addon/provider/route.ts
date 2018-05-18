import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import config from 'collections/config/environment';
import Theme from 'collections/services/theme';
import DS from 'ember-data';

export default class Provider extends Route {
    @service store!: DS.Store;
    @service theme!: Theme;

    async beforeModel(this: Provider, transition: any) {
        const { slug = '' } = transition.params['collections.provider'];
        const slugLower = slug.toLowerCase();

        try {
            await this.store.findRecord('preprint-provider', slugLower);

            const { pathname } = window.location;
            const pathRegex = new RegExp(`^/collections/${slug}`);

            if (slug !== slugLower) {
                window.location.pathname = pathname.replace(
                    pathRegex,
                    `/collections/${slugLower}`,
                );
            }

            this.theme.set('id', slugLower);
        } catch (e) {
            this.theme.set('id', config.defaultProvider);

            if (slug.length === 5) {
                this.transitionTo('content', slug);
            } else {
                this.replaceWith('page-not-found');
            }
        }
    }
}

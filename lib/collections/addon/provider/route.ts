import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DS from 'ember-data';

import Theme from 'ember-osf-web/services/theme';

export default class Provider extends Route {
    @service store!: DS.Store;

    @service theme!: Theme;

    async beforeModel() {
        const { slug = '' } = this.paramsFor(this.routeName) as { slug?: string };
        const slugLower = slug.toLowerCase();

        try {
            await this.store.findRecord('collection-provider', slugLower);

            if (slug !== slugLower) {
                const { pathname } = window.location;
                const pathRegex = new RegExp(`^/collections/${slug}`);

                window.location.pathname = pathname.replace(
                    pathRegex,
                    `/collections/${slugLower}`,
                );
            }

            this.theme.setProperties({
                id: slugLower,
                providerType: 'collection',
            });
        } catch (e) {
            this.theme.reset();
            this.replaceWith('page-not-found');
        }
    }

    deactivate() {
        this.theme.reset();
    }
}

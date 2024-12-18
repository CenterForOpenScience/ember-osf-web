import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import Toast from 'ember-toastr/services/toast';

import Theme from 'ember-osf-web/services/theme';
import MetaTags, { HeadTagDef } from 'ember-osf-web/services/meta-tags';
import PreprintModel from 'ember-osf-web/models/preprint';

export default class PreprintNewVersionRoute extends Route {
    @service store!: Store;
    @service theme!: Theme;
    @service router!: RouterService;
    @service metaTags!: MetaTags;
    @service toast!: Toast;
    @service intl!: Intl;


    headTags?: HeadTagDef[];

    buildRouteInfoMetadata() {
        return {
            osfMetrics: {
                providerId: this.theme.id,
            },
        };
    }

    async model(args: any) {
        try {
            const provider = await this.store.findRecord('preprint-provider', args.provider_id);
            this.theme.providerType = 'preprint';
            this.theme.id = args.provider_id;

            const preprint: PreprintModel = await this.store.findRecord('preprint', args.guid);

            if (!preprint.canCreateNewVersion) {
                let message = this.intl.t('prperints.submit.new-version.redirect.latest-published',
                    { preprintWord: provider.documentType.singular });
                if (!preprint.currentUserIsAdmin) {
                    message = this.intl.t('prperints.submit.new-version.redirect.permission',
                        { preprintWord: provider.documentType.singular });
                }

                const title = this.intl.t('prperints.submit.new-version.redirect.title');
                this.toast.info(message, title);
                this.router.transitionTo('preprints.detail', args.provider_id, args.guid);
                return null;
            }

            return {
                provider,
                preprint,
                brand: provider.brand.content,
            };
        } catch (e) {
            this.router.transitionTo('not-found', `preprints/${args.provider_id}`);
            return null;
        }
    }

    afterModel(model: any) {
        const {provider} = model;
        if (provider && provider.assets && provider.assets.favicon) {
            const headTags = [{
                type: 'link',
                attrs: {
                    rel: 'icon',
                    href: provider.assets.favicon,
                },
            }];
            this.set('headTags', headTags);
        }
    }
}

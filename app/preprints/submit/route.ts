import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import PreprintProviderModel from 'ember-osf-web/models/preprint-provider';
import MetaTags, { HeadTagDef } from 'ember-osf-web/services/meta-tags';
import Theme from 'ember-osf-web/services/theme';
import requireAuth from 'ember-osf-web/decorators/require-auth';
// eslint-disable-next-line ember/no-mixins
import ConfirmationMixin from 'ember-onbeforeunload/mixins/confirmation';
import { action, computed } from '@ember/object';
import PreprintSubmit from 'ember-osf-web/preprints/submit/controller';
import Intl from 'ember-intl/services/intl';
import Transition from '@ember/routing/-private/transition';

@requireAuth()
export default class PreprintSubmitRoute extends Route.extend(ConfirmationMixin, {}) {
    @service store!: Store;
    @service intl!: Intl;
    @service theme!: Theme;
    @service router!: RouterService;
    @service metaTags!: MetaTags;
    headTags?: HeadTagDef[];

    // This does NOT work on chrome and I'm going to leave it just in case
    confirmationMessage = this.intl.t('preprints.submit.action-flow.save-before-exit');

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
            return {
                provider,
                brand: provider.brand.content,
                displayDialog: this.displayDialog,
            };
        } catch (e) {

            this.router.transitionTo('not-found', `preprints/${args.provider_id}/submit`);
            return null;
        }
    }

    afterModel(model: PreprintProviderModel) {
        if (model && model.assets && model.assets.favicon) {
            const headTags = [{
                type: 'link',
                attrs: {
                    rel: 'icon',
                    href: model.assets.favicon,
                },
            }];
            this.set('headTags', headTags);
        }
    }

    // This tells ember-onbeforeunload's ConfirmationMixin whether or not to stop transitions
    // This is for when the user leaves the site or does a full app reload
    @computed('controller.isPageDirty')
    get isPageDirty() {
        const controller = this.controller as PreprintSubmit;
        return () => controller.isPageDirty;
    }

    // This is for when the user leaves the page via the router
    @action
    willTransition(transition: Transition) {
        const controller = this.controller as PreprintSubmit;
        if (controller.isPageDirty) {
            if (!window.confirm(this.intl.t('preprints.submit.action-flow.save-before-exit'))) {
                transition.abort();
            }
        }
    }
}

import Controller from '@ember/controller';
import { alias, match } from '@ember/object/computed';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import { camelize } from '@ember/string';
import Features from 'ember-feature-flags/services/features';
import config from 'ember-get-config';

import Theme from 'ember-osf-web/services/theme';
import OsfModalState from 'osf-components/services/osf-modal-state';

const {
    featureFlagNames: {
        verifyEmailModals,
    },
} = config;

export default class Application extends Controller {
    @service router!: RouterService;
    @service theme!: Theme;
    @service features!: Features;
    @service osfModalState!: OsfModalState;

    queryParams = [{
        viewOnlyToken: {
            as: 'view_only',
            // scope needs the literal type `'controller'`, not just `string`
            scope: 'controller' as 'controller',
        },
    }];
    viewOnlyToken = '';

    @alias(`features.${camelize(verifyEmailModals)}`)
    shouldShowVerifyEmailModals!: boolean;

    // This is a hack until we move the main application into it's own engine.
    // Then each engine will be in charge of rendering/customizing the header.
    // Feel free to move it over, any time. Just go for it. We'll love you. I promise.
    @match('router.currentRouteName', /^handbook|^registries/) disableHeader!: boolean;
}

declare module '@ember/controller' {
    interface Registry {
        application: Application;
    }
}

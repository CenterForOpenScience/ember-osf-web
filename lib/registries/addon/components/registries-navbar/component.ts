import { tagName } from '@ember-decorators/component';
import { computed } from '@ember/object';
import { and } from '@ember/object/computed';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import { camelize } from '@ember/string';
import Features from 'ember-feature-flags/services/features';
import config from 'ember-get-config';

import { layout } from 'ember-osf-web/decorators/component';
import RegistrationProviderModel from 'ember-osf-web/models/registration-provider';
import defaultTo from 'ember-osf-web/utils/default-to';
import Media from 'ember-responsive';
import { AuthBase } from 'osf-components/components/osf-navbar/auth-dropdown/component';
import { OSF_SERVICES } from 'osf-components/components/osf-navbar/component';
import registriesConfig from 'registries/config/environment';

import template from './template';

const { externalLinks, defaultProviderId } = registriesConfig;
const {
    featureFlagNames: {
        egapAdmins,
    },
} = config;

@tagName('')
@layout(template)
export default class RegistriesNavbar extends AuthBase {
    @service media!: Media;
    @service router!: RouterService;
    @service features!: Features;

    provider?: RegistrationProviderModel;

    @and('media.isMobile', 'searchDropdownOpen') showSearchDropdown!: boolean;

    @computed('provider')
    get providerId() {
        return this.provider ? this.provider.id : defaultProviderId;
    }

    @computed('media.{isMobile,isTablet}', 'provider.brand')
    get shouldShowProviderName() {
        return !this.media.isMobile && !this.media.isTablet && this.provider && this.provider.brand;
    }

    @computed('provider.{allowSubmissions,id}')
    get showAddRegistrationButton() {
        // Check if this is OSF Registries
        if (!this.provider) {
            return true;
        }
        if (this.provider.id === 'egap') {
            return this.features.isEnabled(camelize(egapAdmins));
        }
        return this.provider.allowSubmissions || this.provider.currentUserCanReview;
    }

    services = OSF_SERVICES;
    helpRoute: string = defaultTo(this.helpRoute, externalLinks.help);
    donateRoute: string = defaultTo(this.donateRoute, externalLinks.donate);
}

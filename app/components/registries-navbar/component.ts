import { tagName } from '@ember-decorators/component';
import { action } from '@ember/object';
import { and } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import defaultTo from 'ember-osf-web/utils/default-to';
import { AuthBase } from 'osf-components/components/osf-navbar/auth-dropdown/component';
import { OSF_SERVICES } from 'osf-components/components/osf-navbar/component';
import config from 'registries/config/environment';

import template from './template';

const { externalLinks } = config;

@tagName('')
@layout(template)
export default class RegistriesNavbar extends AuthBase {
    @service media!: Media;

    @requiredAction onSearch!: (query: string) => void;
    @and('media.isMobile', 'searchDropdownOpen') showSearchDropdown!: boolean;

    services = OSF_SERVICES;
    helpRoute: string = defaultTo(this.helpRoute, externalLinks.help);
    donateRoute: string = defaultTo(this.donateRoute, externalLinks.donate);

    searchDropdownOpen: boolean = false;

    @action
    _onSearch(query: string) {
        this.onSearch(query);
        this.set('searchDropdownOpen', false);
    }

    @action
    toggleMobileSearch() {
        this.set('searchDropdownOpen', !this.searchDropdownOpen);
    }
}

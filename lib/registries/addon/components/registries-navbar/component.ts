import { layout, tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import { and } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import { requiredAction } from 'ember-osf-web/decorators/component';
import defaultTo from 'ember-osf-web/utils/default-to';
import Media from 'ember-responsive';
import { AuthBase } from 'osf-components/components/osf-navbar/auth-dropdown/component';
import { OSF_SERVICES } from 'osf-components/components/osf-navbar/component';
import template from './template';

@tagName('')
@layout(template)
export default class RegistriesNavbar extends AuthBase {
    @service media!: Media;

    @requiredAction onSearch!: (query: string) => void;
    @and('media.isMobile', 'searchDropdownOpen') showSearchDropdown!: boolean;

    services = OSF_SERVICES;
    helpRoute: string = defaultTo(this.helpRoute, 'http://help.osf.io/m/registrations/');
    donateRoute: string = defaultTo(this.donateRoute, 'https://cos.io/donate');

    searchDropdownOpen: boolean = false;

    @action
    _onSearch(this: RegistriesNavbar, query: string) {
        this.onSearch(query);
        this.set('searchDropdownOpen', false);
    }

    @action
    toggleMobileSearch() {
        this.set('searchDropdownOpen', !this.searchDropdownOpen);
    }
}

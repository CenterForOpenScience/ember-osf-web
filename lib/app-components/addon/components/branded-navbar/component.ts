import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import config from 'ember-get-config';
import Intl from 'ember-intl/services/intl';
import Media from 'ember-responsive';
import Session from 'ember-simple-auth/services/session';
import { tracked } from 'tracked-built-ins';

import { serviceLinks } from 'ember-osf-web/const/service-links';
import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import BrandModel from 'ember-osf-web/models/brand';
import PreprintProviderModel from 'ember-osf-web/models/preprint-provider';
import ProviderModel from 'ember-osf-web/models/provider';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUserService from 'ember-osf-web/services/current-user';
import Theme from 'ember-osf-web/services/theme';

import styles from './styles';
import template from './template';

type ObjectType = 'collection' | 'preprint' | 'registration';

const osfURL = config.OSF.url;

@layout(template, styles)
@tagName('')
export default class BrandedNavbar extends Component {
    @service analytics!: Analytics;
    @service intl!: Intl;
    @service media!: Media;
    @service session!: Session;
    @service theme!: Theme;
    @service currentUser!: CurrentUserService;

    brandRoute!: string;
    objectType!: ObjectType;
    signupUrl!: string;
    translateKey!: string;
    @tracked showNavLinks = false;
    campaign = `${this.theme.id}-collections`;

    myProjectsUrl = serviceLinks.myProjects;

    get reviewUrl() {
        return `${osfURL}reviews`;
    }

    get submitPreprintUrl() {
        return this.theme.isProvider ? `${osfURL}preprints/${this.theme.id}/submit/` : `${osfURL}preprints/submit/`;
    }

    @alias('theme.provider') provider!: ProviderModel;
    @alias('theme.provider.id') providerId!: string;
    @alias('theme.provider.brand.primaryColor') brandPrimaryColor!: BrandModel;

    get useWhiteBackground(): boolean {
        const { provider } = this.theme;
        if (provider) {
            return this.theme.providerType === 'preprint' && ['biohackrxiv', 'nutrixiv'].includes(provider.id);
        }
        return false;
    }

    @computed('intl.locale', 'theme.{providerType,provider.providerTitle}', 'translateKey')
    get brandTitle(): string {
        if (this.theme.providerType === 'collection') {
            const { name } = this.theme.provider!;
            return this.intl.t(this.translateKey, { name });
        } else { // preprint
            return (this.theme.provider as PreprintProviderModel).providerTitle;
        }
    }

    @requiredAction loginAction!: () => void;

    @action
    toggleSecondaryNavigation() {
        this.showNavLinks = !this.showNavLinks;
    }

    get isMobileOrTablet() {
        return this.media.isMobile || this.media.isTablet;
    }

    get shouldShowNavLinks() {
        if (this.isMobileOrTablet) {
            return this.showNavLinks;
        }
        return true;
    }
}

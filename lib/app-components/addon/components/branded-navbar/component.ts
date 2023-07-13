import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import Media from 'ember-responsive';
import Session from 'ember-simple-auth/services/session';
import { tracked } from 'tracked-built-ins';

import { serviceLinks } from 'ember-osf-web/const/service-links';
import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import Analytics from 'ember-osf-web/services/analytics';
import Theme from 'ember-osf-web/services/theme';
import styles from './styles';
import template from './template';

type ObjectType = 'collection' | 'preprint' | 'registration';

@layout(template, styles)
@tagName('')
export default class BrandedNavbar extends Component {
    @service analytics!: Analytics;
    @service intl!: Intl;
    @service media!: Media;
    @service session!: Session;
    @service theme!: Theme;

    brandRoute!: string;
    objectType!: ObjectType;
    signupUrl!: string;
    translateKey!: string;
    @tracked showNavLinks = false;
    campaign = `${this.theme.id}-collections`;

    myProjectsUrl = serviceLinks.myProjects;

    @alias('theme.provider.id') providerId!: string;

    @computed('intl.locale', 'theme.provider', 'translateKey')
    get brandTitle(): string {
        const { name } = this.theme.provider!;

        return this.intl.t(this.translateKey, { name });
    }

    @requiredAction loginAction!: () => void;

    @action
    toggleSecondaryNavigation() {
        this.toggleProperty('showNavLinks');
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

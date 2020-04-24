import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import Session from 'ember-simple-auth/services/session';

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

    @service session!: Session;

    @service theme!: Theme;

    brandRoute: string = this.brandRoute;

    objectType: ObjectType = this.objectType;

    signupUrl: string = this.signupUrl;

    translateKey: string = this.translateKey;

    showNavLinks: boolean = false;

    myProjectsUrl = serviceLinks.myProjects;

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
}

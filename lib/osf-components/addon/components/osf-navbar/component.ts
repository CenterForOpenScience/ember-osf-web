import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Features from 'ember-feature-flags/services/features';
import config from 'ember-get-config';
import Media from 'ember-responsive';
import Session from 'ember-simple-auth/services/session';
import { tracked } from 'tracked-built-ins';

import { layout } from 'ember-osf-web/decorators/component';
import Analytics from 'ember-osf-web/services/analytics';

import styles from './styles';
import template from './template';

const osfURL = config.OSF.url;

export enum OSFService {
    HOME = 'HOME',
    PREPRINTS = 'PREPRINTS',
    REGISTRIES = 'REGISTRIES',
    MEETINGS = 'MEETINGS',
    INSTITUTIONS = 'INSTITUTIONS',
}

interface ServiceLink {
    name: string;
    route?: string;
    href?: string;
}

export const OSF_SERVICES: ServiceLink[] = [
    { name: OSFService.HOME, route: 'home' },
    { name: OSFService.PREPRINTS, href: `${osfURL}preprints/` },
    { name: OSFService.REGISTRIES, route: 'registries' },
    { name: OSFService.MEETINGS, route: 'meetings' },
    { name: OSFService.INSTITUTIONS, route: 'institutions' },
];

@layout(template, styles)
export default class OsfNavbar extends Component {
    @service analytics!: Analytics;
    @service features!: Features;
    @service media!: Media;
    @service router!: any;
    @service session!: Session;

    @tracked showNavLinks = false;

    activeService: OSFService = OSFService.HOME;
    services: ServiceLink[] = OSF_SERVICES;

    @computed('activeService', 'router.currentRouteName', 'services')
    get _activeService() {
        let { activeService } = this;

        const { currentRouteName } = this.router;
        if (activeService === OSFService.HOME && currentRouteName) {
            for (const osfService of OSF_SERVICES) {
                if (!osfService.route) {
                    continue;
                }
                const routeRegExp = new RegExp(`^${osfService.route}($|\\.)`);
                if (routeRegExp.test(currentRouteName)) {
                    activeService = osfService.name as OSFService;
                    break;
                }
            }
        }

        return this.services.find(x => x.name === activeService);
    }

    @action
    onClickPrimaryDropdown() {
        this.set('showNavLinks', false);
        this.analytics.click('button', 'Navbar - Dropdown Arrow');
    }

    @action
    toggleSecondaryNavigation() {
        this.toggleProperty('showNavLinks');
    }

    @action
    onLinkClicked() {
        this.set('showNavLinks', false);
    }

    get shouldShowNavLinks() {
        if (!(this.media.isMobile || this.media.isTablet)) {
            return true;
        }
        return this.showNavLinks;
    }
}

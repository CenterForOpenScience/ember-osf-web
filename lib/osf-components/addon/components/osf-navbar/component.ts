import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import Features from 'ember-feature-flags/services/features';
import config from 'ember-get-config';
import Analytics from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';
import Session from 'ember-simple-auth/services/session';
import styles from './styles';
import layout from './template';

const osfURL = config.OSF.url;

export enum OSFService {
    HOME = 'HOME',
    PREPRINTS = 'PREPRINTS',
    REGISTRIES = 'REGISTRIES',
    MEETINGS = 'MEETINGS',
    INSTITUTIONS = 'INSTITUTIONS',
}

export const OSF_SERVICES = [
    { name: OSFService.HOME, route: 'home' },
    { name: OSFService.PREPRINTS, route: `${osfURL}preprints/` },
    { name: OSFService.REGISTRIES, route: config.engines.registries.enabled ? 'registries' : `${osfURL}registries/` },
    { name: OSFService.MEETINGS, route: `${osfURL}meetings/` },
    { name: OSFService.INSTITUTIONS, route: 'institutions' },
];

export default class OsfNavbar extends Component {
    layout = layout;
    styles = styles;

    @service analytics!: Analytics;
    @service features!: Features;
    @service router!: any;
    @service session!: Session;

    showNavLinks: boolean = false;

    activeService: OSFService = defaultTo(this.activeService, OSFService.HOME);
    services: Array<{name: OSFService, route: string}> = defaultTo(this.services, OSF_SERVICES);

    @computed('activeService', 'router.currentRouteName')
    get _activeService() {
        let { activeService } = this;

        // HACK/Special case until institutions are put into an engine
        if (activeService === OSFService.HOME && this.router.currentRouteName === 'institutions') {
            activeService = OSFService.INSTITUTIONS;
        }

        return this.services.find(x => x.name === activeService);
    }

    @action
    onClickPrimaryDropdown(this: OsfNavbar) {
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
}

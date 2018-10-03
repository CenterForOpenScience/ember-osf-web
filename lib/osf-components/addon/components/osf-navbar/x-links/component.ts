import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import config from 'ember-get-config';
import CurrentUser from 'ember-osf-web/services/current-user';
import defaultTo from 'ember-osf-web/utils/default-to';
import Session from 'ember-simple-auth/services/session';
import layout from './template';

const osfURL = config.OSF.url;

@tagName('') // Don't wrap this component in a div
export default class XLinks extends Component {
    layout = layout;

    @service router!: any;
    @service session!: Session;
    @service currentUser!: CurrentUser;

    searchURL: string = defaultTo(this.searchURL, `${osfURL}search/`);
    myProjectsURL: string = defaultTo(this.myProjectsURL, `${osfURL}myprojects/`);
    myRegistrationsURL: string = defaultTo(this.myRegistrationsURL, `${osfURL}myprojects/#registrations`);

    @computed('router.currentRouteName')
    get supportURL() {
        return this.onInstitutions ? 'http://help.osf.io/m/institutions' : 'osf.support';
    }

    @computed('router.currentRouteName')
    get onInstitutions() {
        return this.router.currentRouteName === 'institutions';
    }
}

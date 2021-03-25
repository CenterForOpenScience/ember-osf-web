import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import config from 'ember-get-config';
import Session from 'ember-simple-auth/services/session';

import { layout } from 'ember-osf-web/decorators/component';
import CurrentUser from 'ember-osf-web/services/current-user';

import template from './template';

const osfURL = config.OSF.url;

@layout(template)
@tagName('') // Don't wrap this component in a div
export default class XLinks extends Component {
    @service router!: any;
    @service session!: Session;
    @service currentUser!: CurrentUser;

    searchURL: string = `${osfURL}search/`;
    myProjectsURL: string = `${osfURL}myprojects/`;
    myRegistrationsURL: string = `${osfURL}myprojects/#registrations`;
    onLinkClicked: () => void = () => null;

    @computed('router.currentRouteName')
    get supportURL() {
        return this.onInstitutions ? 'https://openscience.zendesk.com/hc/en-us/categories/360001550913' : 'support';
    }

    @computed('router.currentRouteName')
    get onInstitutions() {
        return this.router.currentRouteName === 'institutions';
    }
}

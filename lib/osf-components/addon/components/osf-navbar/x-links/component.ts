import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import config from 'ember-get-config';
import Session from 'ember-simple-auth/services/session';

import { layout } from 'ember-osf-web/decorators/component';

import template from './template';

const osfURL = config.OSF.url;

@layout(template)
@tagName('') // Don't wrap this component in a div
export default class XLinks extends Component {
    @service session!: Session;

    searchURL = `${osfURL}search/`;
    myProjectsURL = `${osfURL}myprojects/`;
    myRegistrationsURL = `${osfURL}myprojects/#registrations`;
    supportURL = `${config.support.faqPageUrl}`;
    onLinkClicked: () => void = () => null;
}

import Component from '@ember/component';

import { ChangesetDef } from 'ember-changeset/types';
import { layout } from 'ember-osf-web/decorators/component';
import Registration from 'ember-osf-web/models/registration';
import { LicenseManager } from 'osf-components/components/editable-field/license-manager/component';

import styles from './styles';
import template from './template';

@layout(template, styles)
export default class RegistriesLicensePicker extends Component {
    manager!: LicenseManager;

    showText: boolean = false;
    helpLink: string = 'https://help.osf.io/hc/en-us/articles/360019739014-Licensing';
    registration!: ChangesetDef | Registration;

    init() {
        super.init();
        if (this.manager.changeset) {
            this.set('registration', this.manager.changeset);
        } else {
            this.set('registration', this.manager.registration);
        }
    }
}

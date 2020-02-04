import Component from '@ember/component';
import { action } from '@ember/object';

import { ChangesetDef } from 'ember-changeset/types';
import { layout } from 'ember-osf-web/decorators/component';
import License from 'ember-osf-web/models/license';
import Registration from 'ember-osf-web/models/registration';

import styles from './styles';
import template from './template';

interface LicenseManager {
    onSave?: () => void;
    onError?: () => void;
    onCancel?: () => void;
    onInput?: () => void;
    changeLicense: () => void;
    registration: Registration | ChangesetDef;
    requiredFields: string[];
    selectedLicense: License;
    licensesAcceptable: License[];
}

@layout(template, styles)
export default class RegistriesLicensePicker extends Component {
    manager!: LicenseManager;

    shouldShowButtons: boolean = false;
    inEditMode: boolean = true;
    showText: boolean = false;
    helpLink: string = 'https://help.osf.io/hc/en-us/articles/360019739014-Licensing';
    registration!: ChangesetDef | Registration;

    @action
    onInput() {
        return this.manager.onInput ? this.manager.onInput() : true;
    }
}

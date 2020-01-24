import Component from '@ember/component';

import { ChangesetDef } from 'ember-changeset/types';
import { layout } from 'ember-osf-web/decorators/component';
import License from 'ember-osf-web/models/license';
import Registration from 'ember-osf-web/models/registration';
import DraftRegistrationManager from 'registries/drafts/draft/draft-registration-manager';

import styles from './styles';
import template from './template';

interface LicenseManager {
    queryLicenses: () => void;
    onSave: () => void;
    onError: () => void;
    onCancel: () => void;
    changeLicense: () => void;
    onInput?: () => void;
    registration?: Registration;
    draftRegistrationManager?: DraftRegistrationManager;
    requiredFields: string[];
    selectedLicense: License;
    licensesAcceptable: License[];
}

@layout(template, styles)
export default class RegistriesLicensePicker extends Component {
    manager!: LicenseManager;

    shouldShowButtons: boolean = false;

    showText: boolean = false;
    helpLink: string = 'https://help.osf.io/hc/en-us/articles/360019739014-Licensing';
    registration!: ChangesetDef | Registration;
}

import Component from '@ember/component';
import { action } from '@ember/object';

import { ChangesetDef } from 'ember-changeset/types';
import { layout } from 'ember-osf-web/decorators/component';
import License from 'ember-osf-web/models/license';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import Registration from 'ember-osf-web/models/registration';

import styles from './styles';
import template from './template';

export interface LicenseManager {
    cancel?: () => void;
    onSave?: () => void;
    onError?: () => void;
    onInput?: () => void;
    changeLicense: (selected: License) => void;
    startEditing?: () => void;
    fieldIsEmpty?: License;
    emptyFieldText?: string;
    inEditMode?: boolean;
    userCanEdit?: boolean;
    shouldShowField?: boolean;
    registration?: Registration | ChangesetDef;
    changeset?: ChangesetDef;
    requiredFields: string[];
    selectedLicense: License;
    licensesAcceptable: QueryHasManyResult<License>;
    isSaving?: boolean;
}

@layout(template, styles)
export default class RegistriesLicensePicker extends Component {
    manager!: LicenseManager;

    shouldShowButtons: boolean = false;
    showText: boolean = false;
    helpLink: string = 'https://help.osf.io/hc/en-us/articles/360019739014-Licensing';
    registration!: ChangesetDef | Registration;

    @action
    onInput() {
        if (this.manager.onInput) {
            this.manager.onInput();
        }
    }
}

import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import { LicenseManager } from 'osf-components/components/editable-field/license-manager/component';

import styles from './styles';
import template from './template';

@layout(template, styles)
export default class RegistriesLicensePicker extends Component {
    manager!: LicenseManager;

    showText: boolean = false;
    helpLink: string = 'https://help.osf.io/hc/en-us/articles/360019739014-Licensing';
}

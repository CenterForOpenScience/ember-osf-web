import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import { LicenseManager } from 'osf-components/components/editable-field/license-manager/component';

import styles from './styles';
import template from './template';

@layout(template, styles)
export default class RegistriesLicensePicker extends Component {
    manager!: LicenseManager;

    showText: boolean = false;
    helpLink: string = 'http://help.osf.io/m/60347/l/611430-licensing';
}

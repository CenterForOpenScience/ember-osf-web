import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import { ProviderMetadataManager } from 'osf-components/components/editable-field/provider-metadata-manager/component';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class ProviderMetadataEditable extends Component {
    manager!: ProviderMetadataManager;
}

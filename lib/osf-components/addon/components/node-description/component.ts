import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import { DescriptionManager } from 'osf-components/components/editable-field/description-manager/component';
import styles from './styles';
import template from './template';

@tagName('')
@layout(template, styles)
export default class NodeDescription extends Component {
    manager!: DescriptionManager;
}

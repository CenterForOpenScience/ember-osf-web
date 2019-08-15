import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import { DescriptionManager } from 'osf-components/components/editable-field/description-manager/component';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class NodeDescriptionEditable extends Component {
    manager!: DescriptionManager;
}

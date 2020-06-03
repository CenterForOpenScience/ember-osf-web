import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import Node from 'ember-osf-web/models/node';

import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class Widget extends Component {
    // Required arguments
    node!: Node;
    widgetMode: string = 'readonly';
}

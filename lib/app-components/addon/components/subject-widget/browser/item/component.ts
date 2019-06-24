import Component from '@ember/component';

import { ItemManager } from 'app-components/components/subject-widget/browser/item-manager/component';
import { layout } from 'ember-osf-web/decorators/component';

import styles from './styles';
import template from './template';

@layout(template, styles)
export default class ItemDisplay extends Component {
    manager!: ItemManager;
}

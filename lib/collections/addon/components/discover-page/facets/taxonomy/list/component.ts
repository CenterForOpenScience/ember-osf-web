import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { localClassNames } from 'ember-css-modules';

import { layout } from 'ember-osf-web/decorators/component';
import { TaxonomyItem } from '../component';
import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('ul')
@localClassNames('taxonomy-list')
export default class TaxonomyList extends Component {
    children: TaxonomyItem[] = this.children;
    activeFilter: string[] = this.activeFilter;
    expandedList: string[] = this.expandedList;
}

import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { localClassNames } from 'ember-osf-web/decorators/css-modules';
import { TaxonomyItem } from '../component';
import styles from './styles';
import layout from './template';

@tagName('ul')
@localClassNames('taxonomy-list')
export default class TaxonomyList extends Component {
    layout = layout;
    styles = styles;

    children: TaxonomyItem[] = this.children;
    activeFilter: string[] = this.activeFilter;
    expandedList: string[] = this.expandedList;
}

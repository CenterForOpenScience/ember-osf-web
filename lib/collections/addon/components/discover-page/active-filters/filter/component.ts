import { tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import Component from '@ember/component';
import defaultTo from 'ember-osf-web/utils/default-to';
import { FacetContext } from '../../component';
import styles from './styles';
import layout from './template';

@tagName('')
export default class ActiveFiltersFilter extends Component {
    layout = layout;
    styles = styles;

    context: FacetContext = this.context;
    item: any = this.item;
    text: string = this.text;
    ariaLabel: string = this.ariaLabel;
    hide: boolean = defaultTo(this.hide, false);
    extraClass: string = defaultTo(this.extraClass, '');

    @action
    removeFilterItem(item: any): void {
        this.context.updateFilters(item);
    }
}

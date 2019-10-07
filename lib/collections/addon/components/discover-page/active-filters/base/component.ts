import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action } from '@ember/object';

import defaultTo from 'ember-osf-web/utils/default-to';

import { FacetContext } from '../../component';

@tagName('span')
export default class ActiveFilterBase extends Component {
    context: FacetContext = this.context;
    item: any = this.item;
    text: string = this.text;
    ariaLabel: string = this.ariaLabel;
    extraClass: string = defaultTo(this.extraClass, '');

    @action
    removeFilterItem(item: any): void {
        this.context.updateFilters(item);
    }
}

import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action } from '@ember/object';

import { FacetContext } from '../../component';

@tagName('span')
export default class ActiveFilterBase extends Component {
    context!: FacetContext;
    item!: any;
    text!: string;
    ariaLabel!: string;
    extraClass = '';

    @action
    removeFilterItem(item: any): void {
        this.context.updateFilters(item);
    }
}

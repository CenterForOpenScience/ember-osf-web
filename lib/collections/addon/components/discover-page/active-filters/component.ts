import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { get } from '@ember/object';
import requiredAction from 'ember-osf-web/decorators/required-action';
import Theme from 'ember-osf-web/services/theme';
import { FacetContexts } from '../component';

export default class ActiveFilters extends Component {
    @service theme!: Theme;
    filterReplace: any = this.filterReplace;

    facetContexts: FacetContexts = this.facetContexts;

    @requiredAction filterChanged!: () => void;

    @action
    removeFilterItem(facet: keyof FacetContexts, item: any): void {
        const context = get(this.facetContexts, facet);

        context.updateFilters(item);

        this.filterChanged();
    }
}

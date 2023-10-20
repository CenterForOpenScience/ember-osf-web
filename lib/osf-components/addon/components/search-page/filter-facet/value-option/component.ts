import Component from '@glimmer/component';

import SearchResultModel from 'ember-osf-web/models/search-result';

interface ValueOptionArgs {
    option: SearchResultModel;
    isSelected?: Boolean;
}

export default class ValueOption extends Component<ValueOptionArgs> {
    get additionalDetail() {
        const { affiliation: affiliatedEntities = [] } = this.args.option.resourceMetadata;
        return affiliatedEntities.flatMap(
            (entity: any) => entity.name?.map((name: any) => name['@value']),
        ).filter(Boolean).join(', ');
    }
}

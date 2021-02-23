import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';

import { layout } from 'ember-osf-web/decorators/component';
import { NodeCategory } from 'ember-osf-web/models/node';
import template from './template';

const categoryToIconMap: Record<NodeCategory, string> = {
    analysis: 'chart-bar',
    communication: 'comment',
    data: 'database',
    hypothesis: 'lightbulb',
    instrumentation: 'flask',
    'methods and measures': 'pencil',
    procedure: 'cogs',
    project: 'cube',
    software: 'laptop',
    other: 'th-large',
    uncategorized: 'circle-notch',
};

@tagName('')
@layout(template)
export default class NodeCategoryPicker extends Component {
    category!: NodeCategory;

    @service intl!: Intl;

    @computed('category')
    get currentCategory() {
        return {
            text: this.intl.t(`node_categories.${this.category}`),
            icon: categoryToIconMap[this.category],
        };
    }
}

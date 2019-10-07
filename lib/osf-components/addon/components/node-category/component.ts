import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import I18N from 'ember-i18n/services/i18n';

import { layout } from 'ember-osf-web/decorators/component';
import { NodeCategory } from 'ember-osf-web/models/node';
import template from './template';

const categoryToIconMap: Record<NodeCategory, string> = {
    analysis: 'bar-chart',
    communication: 'comment',
    data: 'database',
    hypothesis: 'lightbulb-o',
    instrumentation: 'flask',
    'methods and measures': 'pencil',
    procedure: 'cogs',
    project: 'cube',
    software: 'laptop',
    other: 'th-large',
    uncategorized: 'circle-o-notch',
};

@tagName('')
@layout(template)
export default class NodeCategoryPicker extends Component {
    category!: NodeCategory;

    @service i18n!: I18N;

    @computed('category')
    get currentCategory() {
        return {
            text: this.i18n.t(`node_categories.${this.category}`),
            icon: categoryToIconMap[this.category],
        };
    }
}

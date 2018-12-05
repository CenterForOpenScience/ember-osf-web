import { className, tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import defaultTo from 'ember-osf-web/utils/default-to';
import template from './template';

const iconMap: { [index: string]: string } = {
    hypothesis: 'lightbulb-o',
    'methods and measures': 'pencil',
    procedure: 'cogs',
    instrumentation: 'flask',
    data: 'database',
    software: 'laptop',
    project: 'cube',
    analysis: 'bar-chart',
    communication: 'comment',
    other: 'th-large',
    collection: 'cubes',
    smartCollection: 'certificate',
    registration: 'th-list',
    component: 'th-large',
    registeredComponent: 'th-large',
    link: 'link',
    preprint: 'file-text',
};

@layout(template)
@tagName('span')
export default class NodeCardNodeIcon extends Component {
    category: string = defaultTo(this.category, '');

    @computed('category')
    get iconType(this: NodeCardNodeIcon): string {
        return iconMap[this.get('category')] || 'circle-o-notch';
    }

    @className('text-muted', '')
    @computed('category')
    get isMuted(this: NodeCardNodeIcon): boolean {
        return ['registration', 'registeredComponent'].includes(this.get('category'));
    }
}

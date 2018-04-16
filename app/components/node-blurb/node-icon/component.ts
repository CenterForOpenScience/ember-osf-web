import { className, tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';

import Component from '@ember/component';

const iconMap = {
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
    '': 'circle-o-notch',
    collection: 'cubes',
    smartCollection: 'certificate',
    registration: 'th-list',
    component: 'th-large',
    registeredComponent: 'th-large',
    link: 'link',
    preprint: 'file-text',
};

@tagName('span')
export default class NodeBlurbNodeIcon extends Component {
    category: string;

    @computed('category')
    get iconType(this: NodeBlurbNodeIcon): string {
        return iconMap[this.get('category')] || '';
    }

    @className('text-muted', '')
    @computed('category')
    get active(this: NodeBlurbNodeIcon): boolean {
        return ['registration', 'registeredComponent'].includes(this.get('category'));
    }
}

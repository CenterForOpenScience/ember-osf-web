import { className, tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import Component from '@ember/component';
import defaultTo from 'ember-osf-web/utils/default-to';
import layout from './template';

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

@tagName('span')
export default class NodeBlurbNodeIcon extends Component {
    layout = layout;

    category: string = defaultTo(this.category, '');

    @computed('category')
    get iconType(this: NodeBlurbNodeIcon): string {
        return iconMap[this.get('category')] || 'circle-o-notch';
    }

    @className('text-muted', '')
    @computed('category')
    get isMuted(this: NodeBlurbNodeIcon): boolean {
        return ['registration', 'registeredComponent'].includes(this.get('category'));
    }
}

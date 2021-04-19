import { className, tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { computed } from '@ember/object';

import { layout } from 'ember-osf-web/decorators/component';

import template from './template';

const iconMap: { [index: string]: string } = {
    hypothesis: 'lightbulb',
    'methods and measures': 'pencil-alt',
    procedure: 'cogs',
    instrumentation: 'flask',
    data: 'database',
    software: 'laptop',
    project: 'cube',
    analysis: 'chart-bar',
    communication: 'comment',
    other: 'th-large',
    collection: 'cubes',
    smartCollection: 'certificate',
    registration: 'th-list',
    component: 'th-large',
    registeredComponent: 'th-large',
    link: 'link',
    preprint: 'file-alt',
};

@layout(template)
@tagName('span')
export default class NodeCardNodeIcon extends Component {
    category: string = '';

    @computed('category')
    get iconType(): string {
        return iconMap[this.category] || 'circle-notch';
    }

    @className('text-muted', '')
    @computed('category')
    get isMuted(): boolean {
        return ['registration', 'registeredComponent'].includes(this.category);
    }
}

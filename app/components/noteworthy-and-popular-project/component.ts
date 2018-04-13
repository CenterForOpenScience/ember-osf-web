import Component from '@ember/component';
import { computed } from '@ember/object';

export default class NoteworthyAndPopularProject extends Component {
    compactDescription = computed('project.description', function(): string {
        const desc = this.get('project.description') || '';
        return desc.length > 115 ? `${desc.slice(0, 111)}\u2026` : desc;
    });
}

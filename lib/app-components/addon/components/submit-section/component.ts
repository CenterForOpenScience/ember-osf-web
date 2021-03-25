import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { localClassNames } from 'ember-css-modules';

import { layout } from 'ember-osf-web/decorators/component';
import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('section')
@localClassNames('Component')
export default class SubmitSection extends Component {
    tooltip!: string;
    title!: string;
    description?: string;
    section!: number;
    activeSection!: number;
    savedSections!: number[];
    editable: boolean = true;

    @computed('activeSection', 'section')
    get isOpen(): boolean {
        return this.activeSection === this.section;
    }

    @computed('savedSections.[]', 'section')
    get didSave(): boolean {
        return this.savedSections.includes(this.section);
    }

    @computed('isOpen', 'didSave')
    get showTooltip(): boolean {
        return !!this.tooltip && !this.isOpen && !this.didSave;
    }

    @computed('isOpen', 'didSave')
    get showReopen(): boolean {
        return !this.isOpen && this.didSave;
    }

    @action
    editSection(): void {
        this.set('activeSection', this.section);
    }
}

import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import Component from '@ember/component';
import { localClassNames } from 'ember-css-modules';

import { layout } from 'ember-osf-web/decorators/component';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('section')
@localClassNames('Component')
export default class SubmitSection extends Component {
    tooltip: string = this.tooltip;
    title: string = this.title;
    description?: string = this.description;
    section: number = this.section;
    activeSection: number = this.activeSection;
    savedSections: number[] = this.savedSections;
    editable: boolean = defaultTo(this.editable, true);

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
    editSection(this: SubmitSection): void {
        this.set('activeSection', this.section);
    }
}

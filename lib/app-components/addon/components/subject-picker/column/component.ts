import { classNames } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import Taxonomy from 'ember-osf-web/models/taxonomy';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import template from './template';

@layout(template, styles)
@classNames('col-md-4')
export default class Column extends Component {
    filterText: string = defaultTo(this.filterText, '');
    selection: Taxonomy[] = this.selection;
    subjects: Taxonomy[] = this.subjects;

    @computed('subjects.[]', 'filterText')
    get subjectsFiltered() {
        const filterTextLowerCase = this.filterText.toLowerCase();

        if (!filterTextLowerCase) {
            return this.subjects;
        }

        return this.subjects.filter(({ text }) => text.toLowerCase().includes(filterTextLowerCase));
    }
}

import Component from '@ember/component';
import { computed } from '@ember/object';

import { layout } from 'ember-osf-web/decorators/component';
import SubjectModel from 'ember-osf-web/models/subject';

import styles from './styles';
import template from './template';

@layout(template, styles)
export default class SubjectDisplay extends Component {
    // optional
    subjects?: SubjectModel[];

    removeSubject?: (subject: SubjectModel) => void;

    @computed('subjects')
    get isLoading() {
        return typeof this.subjects === 'undefined';
    }
}

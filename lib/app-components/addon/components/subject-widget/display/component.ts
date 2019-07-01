import { computed } from '@ember-decorators/object';
import Component from '@ember/component';

import { SubjectManager } from 'app-components/components/subject-widget/manager/component';
import { layout } from 'ember-osf-web/decorators/component';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class SubjectDisplay extends Component {
    inEditMode: boolean = defaultTo(this.inEditMode, false);
    manager!: SubjectManager;

    @computed(
        'inEditMode',
        'manager.{subjects.[],initializeSubjects.[]}',
    )
    get subjects() {
        return this.inEditMode ? this.manager.subjects : this.manager.initialSubjects;
    }
}

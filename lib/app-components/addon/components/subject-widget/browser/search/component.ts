import { action } from '@ember-decorators/object';
import Component from '@ember/component';
import { task } from 'ember-concurrency';

import { SubjectManager } from 'app-components/components/subject-widget/manager/component';
import { layout } from 'ember-osf-web/decorators/component';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import Subject from 'ember-osf-web/models/subject';

import styles from './styles';
import template from './template';

@layout(template, styles)
export default class SearchSubjects extends Component.extend({
    querySubjects: task(function *(this: SearchSubjects, text: string) {
        const queryResults = yield this.manager.provider.queryHasMany('subjects', {
            filter: {
                text,
            },
            page: {
                size: 150,
            },
            embed: ['parent'],
            related_counts: 'children',
        });

        this.setProperties({ queryResults });
        return queryResults;
    }).restartable(),
}) {
    queryResults!: QueryHasManyResult<Subject>;
    manager!: SubjectManager;
    selectedSubject!: Subject;

    @action
    selectSubject(selectedSubject: Subject) {
        this.setProperties({ selectedSubject });
        if (!this.manager.inModelSubjects(selectedSubject)) {
            this.manager.add(selectedSubject);
        }
    }
}

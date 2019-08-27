import { action, computed } from '@ember-decorators/object';
import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';

import { layout } from 'ember-osf-web/decorators/component';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import Subject from 'ember-osf-web/models/subject';
import { SubjectManager } from 'osf-components/components/subjects/manager/component';

import styles from './styles';
import template from './template';

@layout(template, styles)
export default class SearchSubjects extends Component.extend({
    querySubjects: task(function *(this: SearchSubjects, text: string) {
        yield timeout(500);

        const queryResults = yield this.manager.provider.queryHasMany('subjects', {
            filter: {
                text,
            },
            page: {
                size: 150,
            },
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
        if (!this.inModelSubjects) {
            this.manager.selectSubject(selectedSubject);
        }
    }

    @computed('manager.selectedSubjects.[]')
    get inModelSubjects() {
        return Boolean(this.manager.selectedSubjects.findBy('id', this.selectedSubject.id));
    }
}

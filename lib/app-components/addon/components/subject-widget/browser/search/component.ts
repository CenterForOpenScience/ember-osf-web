import Component from '@ember/component';
import { task } from 'ember-concurrency';

import { SubjectManager } from 'app-components/components/subject-widget/manager/component';
import { layout } from 'ember-osf-web/decorators/component';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import Subject from 'ember-osf-web/models/subject';
import template from './template';

@layout(template)
export default class SearchSubjects extends Component.extend({
    querySubjects: task(function *(this: SearchSubjects, text: string) {
        const queryResults: QueryHasManyResult<Subject> = yield this.manager.provider.queryHasMany('subjects', {
            filter: {
                text,
            },
            page: {
                size: 150,
            },
        });

        this.setProperties({ queryResults });

        return queryResults;
    }).restartable(),
}) {
    queryResults!: QueryHasManyResult<Subject>;
    manager!: SubjectManager;
}

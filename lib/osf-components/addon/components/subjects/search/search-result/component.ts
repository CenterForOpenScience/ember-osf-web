import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { alias } from '@ember/object/computed';
import { task } from 'ember-concurrency-decorators';

import { layout } from 'ember-osf-web/decorators/component';
import SubjectModel from 'ember-osf-web/models/subject';
import { SingleSubjectManager } from 'osf-components/components/subjects/manager/single/component';

import styles from './styles';
import template from './template';

@tagName('')
@layout(template, styles)
export default class SearchResult extends Component {
    singleSubjectManager!: SingleSubjectManager;

    @alias('singleSubjectManager.subject')
    subject?: SubjectModel;

    @alias('loadAncestry.lastSuccessful.value')
    subjectAncestry?: SubjectModel[];

    @task({ withTestWaiter: true, on: 'didReceiveAttrs' })
    async loadAncestry() {
        const { subject } = this.singleSubjectManager;
        if (!subject) {
            return undefined;
        }
        const ancestors: SubjectModel[] = [];
        let nextParentRef = subject.belongsTo('parent');
        while (nextParentRef.id()) {
            // eslint-disable-next-line no-await-in-loop
            const nextParent = await nextParentRef.load();
            ancestors.push(nextParent);
            nextParentRef = nextParent.belongsTo('parent');
        }
        return ancestors.reverse();
    }

    init() {
        super.init();

        assert('@singleSubjectManager is required', Boolean(this.singleSubjectManager));
    }
}

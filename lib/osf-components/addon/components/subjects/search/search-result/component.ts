import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import Component from '@ember/component';
import { task } from 'ember-concurrency';

import { layout } from 'ember-osf-web/decorators/component';
import Subject from 'ember-osf-web/models/subject';

import styles from './styles';
import template from './template';

@tagName('')
@layout(template, styles)
export default class SearchResult extends Component.extend({
    getSubjectAncestry: task(function *(this: SearchResult) {
        if (!this.selectedItem) {
            const ancestors: Subject[] = [];
            const parentSubject = yield this.subject.parent;
            if (parentSubject) {
                const rootSubject = yield parentSubject.parent;
                if (rootSubject) {
                    ancestors.pushObjects([rootSubject, parentSubject]);
                } else {
                    ancestors.pushObjects([parentSubject]);
                }
            }
            this.subjectAncestry.pushObjects(ancestors);
        }
    }).on('didReceiveAttrs').restartable(),
}) {
    subject!: Subject;
    select!: { selected: Subject };
    subjectAncestry: Subject[] = [];

    @computed('select.{selected}')
    get selectedItem() {
        // <SelectedItemComponent @select={{select.selected}}>
        return this.select && this.select.selected;
    }
}

// BEGIN-SNIPPET validate-list.component
import Component from '@ember/component';
import { computed } from '@ember/object';
import { ValidatorResult } from 'ember-changeset-validations';
import { BufferedChangeset } from 'ember-changeset/types';

import buildChangeset from 'ember-osf-web/utils/build-changeset';
import { transposeResults } from 'ember-osf-web/validators/list';

import { validation } from './validation';

export default class ValidateListDemo extends Component {
    changeset!: BufferedChangeset & DemoObject;

    @computed('changeset.error.list.validation')
    get listResults() {
        if (!this.changeset.error.list) {
            return [];
        }
        return transposeResults(
            this.changeset.error.list.validation as ValidatorResult[],
        );
    }

    init() {
        super.init();
        this.set(
            'changeset',
            buildChangeset({ list: ['foo', 'bar', 'baz'] }, validation),
        );
    }
}
// END-SNIPPET

export interface DemoObject {
    list: string[];
}

// BEGIN-SNIPPET validate-list.component
import { computed } from '@ember-decorators/object';
import { reads } from '@ember-decorators/object/computed';
import Component from '@ember/component';
import { ValidatorResult } from 'ember-changeset-validations';
import { ChangesetDef } from 'ember-changeset/types';

import buildChangeset from 'ember-osf-web/utils/build-changeset';
import { pivotErrors } from 'ember-osf-web/validators/list';

import { validation } from './validation';

export default class ValidateListDemo extends Component {
    changeset!: ChangesetDef & DemoObject;

    @reads('changeset.error.list.validation')
    errors?: ValidatorResult[][];

    @computed('errors')
    get listErrors() {
        return pivotErrors(this.errors);
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

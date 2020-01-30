import Component from '@ember/component';
import { assert } from '@ember/debug';
import { computed, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { RawValidationResult } from 'ember-changeset-validations/utils/validation-errors';
import { ChangesetDef } from 'ember-changeset/types';
import Intl from 'ember-intl/services/intl';

import { layout } from 'ember-osf-web/decorators/component';

import styles from './styles';
import template from './template';

@layout(template, styles)
export default class ValidationErrors extends Component {
    @service intl!: Intl;

    changeset!: ChangesetDef;
    key!: string;
    validatorResults!: RawValidationResult[];

    didReceiveAttrs() {
        assert('validation-errors - requires @changeset and @responseKey!', Boolean(this.changeset && this.key));
        const results = this.changeset.get('error')[this.key];
        const validatorResults = results ? results.validation : [];
        set(this, 'validatorResults', validatorResults as unknown as RawValidationResult[]);
    }

    @computed('intl.locale', 'validatorResults.[]')
    get errors() {
        const { validatorResults } = this;
        return validatorResults.map(({ context: { type, translationArgs } }) =>
            this.intl.t(`validationErrors.${type}`, { ...translationArgs }));
    }
}

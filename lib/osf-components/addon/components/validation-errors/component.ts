import { tagName } from '@ember-decorators/component';
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

@tagName('')
@layout(template, styles)
export default class ValidationErrors extends Component {
    @service intl!: Intl;

    changeset!: ChangesetDef;
    key!: string;
    validatorResults!: RawValidationResult[];
    errors?: string[];

    didReceiveAttrs() {
        assert('validation-errors - requires (@changeset and @responseKey!) or @errors',
            Boolean(this.changeset && this.key) || Boolean(this.errors));
        const results = this.changeset.get('error')[this.key];
        const validatorResults = results ? results.validation : [];
        set(this, 'validatorResults', validatorResults as unknown as RawValidationResult[]);
    }

    @computed('intl.locale', 'validatorResults.[]', 'errors.[]')
    get validatorErrors() {
        const { validatorResults, errors } = this;
        if (errors) {
            // TODO: remove when we get rid of ember-cp-validations.
            if (Array.isArray(errors) && errors.every(error => typeof error === 'string')) {
                // default validator messages from ember-cp-validations
                return errors;
            }
            if (typeof errors === 'string') {
                // custom validators that use createErrorMessage...
                // (and extend ember-cp-validations/validators/base) return a translated string.
                return [errors];
            }
        }

        return validatorResults.map(({ context: { type, translationArgs } }) =>
            this.intl.t(`validationErrors.${type}`, { ...translationArgs }));
    }
}

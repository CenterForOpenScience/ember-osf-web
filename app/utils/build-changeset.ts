
import { assert } from '@ember/debug';
import { typeOf } from '@ember/utils';
import Changeset from 'ember-changeset';
import { ChangesetDef, ValidatorFunc } from 'ember-changeset/types';
import ModelRegistry from 'ember-data/types/registries/model';

import { ValidatedModelName } from 'ember-osf-web/models/osf-model';

// Lifted wholesale from https://github.com/offirgolan/ember-changeset-cp-validations/blob/master/addon/index.js
export default function buildChangeset<M extends ValidatedModelName>(model: ModelRegistry[M], options?: {}) {
    assert('Object does not contain any validations', typeOf(model.validations) === 'instance');
    let useOptions = {};
    if (options !== undefined) {
        useOptions = options;
    }
    const validationMap = model.validations.validatableAttributes.reduce(
        (o: any, attr: string) => {
            o[attr] = true; // eslint-disable-line no-param-reassign
            return o;
        },
        {},
    );

    const validateFn: ValidatorFunc = async params => {
        const { validations } = await model.validateAttribute(params.key, params.newValue);
        return validations.isValid ? true : validations.message;
    };

    return new Changeset(model, validateFn, validationMap, useOptions) as ChangesetDef;
}

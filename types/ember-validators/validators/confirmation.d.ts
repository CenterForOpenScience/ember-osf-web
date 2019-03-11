import EmberObject from '@ember/object';
import DS from 'ember-data';
import ModelRegistry from 'ember-data/types/registries/model';
import { validateResult } from 'ember-validators';

import { ValidatedModelName } from 'ember-osf-web/models/osf-model';

export interface ConfirmationOptions {
    allowBlank?: boolean; // Says 'string' in the docs, but the docs lie
    on?: string;
}
export class Confirmation<M extends ValidatedModelName> extends EmberObject {
    validate(
        value: any,
        options: ConfirmationOptions,
        model: ModelRegistry<M>,
        attributes: string,
    ): validateResult | Promise<validateResult>;
}

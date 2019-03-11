import EmberObject from '@ember/object';
import DS from 'ember-data';
import ModelRegistry from 'ember-data/types/registries/model';
import { validateResult } from 'ember-validators';

import { ValidatedModelName } from 'ember-osf-web/models/osf-model';

export interface ExclusionOptions {
    allowBlank?: boolean;
    in?: any[];
    range?: number[];
}
export class Exclusion<M extends ValidatedModelName> extends EmberObject {
    validate(
        value: any,
        options: ExclusionOptions,
        model: ModelRegistry<M>,
        attributes: string,
    ): validateResult | Promise<validateResult>;
}

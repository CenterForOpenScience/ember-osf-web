import EmberObject from '@ember/object';
import DS from 'ember-data';
import ModelRegistry from 'ember-data/types/registries/model';
import { validateResult } from 'ember-validators';

import { ValidatedModelName } from 'ember-osf-web/models/osf-model';

export interface FormatOptions {
    allowBlank?: boolean;
    type?: string;
    inverse?: string;
    regex?: RegExp;
    allowNonTld?: boolean;
    minTldLength?: number;
}
export class Format<M extends ValidatedModelName> extends EmberObject {
    validate(
        value: any,
        options: FormatOptions,
        model: ModelRegistry<M>,
        attributes: string,
    ): validateResult | Promise<validateResult>;
}

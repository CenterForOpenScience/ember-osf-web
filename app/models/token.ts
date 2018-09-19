import { attr, hasMany } from '@ember-decorators/data';
import { buildValidations, validator } from 'ember-cp-validations';

import OsfModel from './osf-model';

const Validations = buildValidations({
    name: [
        validator('presence', true),
        validator('length', { min: 1, max: 200 }),
    ],
    scopes: [
        validator('collection', true),
        validator('presence', true),
    ],
});

export default class TokenModel extends OsfModel.extend(Validations) {
    @attr('fixstring') name!: string; // eslint-disable-line no-restricted-globals
    @attr('fixstring') tokenValue?: string; // Exposed only in response to token creation

    @hasMany('scope') scopes!: string[];

    // @attr('fixstring') owner!: string; Always the current user
}

declare module 'ember-data' {
    interface ModelRegistry {
        'token': TokenModel;
    }
}

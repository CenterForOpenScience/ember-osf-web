import { attr } from '@ember-decorators/data';

import OsfModel from './osf-model';

export default class ScopeModel extends OsfModel {
    @attr('fixstring') description!: string;
}

declare module 'ember-data' {
    interface ModelRegistry {
        'scope': ScopeModel;
    }
}

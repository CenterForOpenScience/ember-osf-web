import RESTAdapter from '@ember-data/adapter/rest';
import ModelRegistry from 'ember-data/types/registries/model';
import config from 'ember-get-config';

export default class UserRegistrationAdapter extends RESTAdapter {
    host: string = config.OSF.url.replace(/\/$/, '');
    namespace = 'api/v1';

    pathForType(_: keyof ModelRegistry) {
        return 'register/';
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'user-registration': UserRegistrationAdapter;
    } // eslint-disable-line semi
}

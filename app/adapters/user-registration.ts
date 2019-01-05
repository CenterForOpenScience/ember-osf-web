import DS from 'ember-data';
import config from 'ember-get-config';

const { RESTAdapter } = DS;

export default class UserRegistrationAdapter extends RESTAdapter {
    host: string = config.OSF.url.replace(/\/$/, '');
    namespace = 'api/v1';

    pathForType(_: string) {
        return 'register/';
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'user-registration': UserRegistrationAdapter;
    } // eslint-disable-line semi
}

import DS from 'ember-data';
import config from 'ember-get-config';

const { RESTAdapter } = DS;

export default class UserRegistration extends RESTAdapter {
    host: string = config.OSF.url.replace(/\/$/, '');
    namespace = 'api/v1';

    pathForType(_: string) {
        return 'register/';
    }
}

declare module 'ember-data' {
    interface AdapterRegistry {
        'user-registration': UserRegistration;
    }
}

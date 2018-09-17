import { ModelInstance } from 'ember-cli-mirage';
import { Links } from 'jsonapi-typescript';
import { RootDocument } from 'osf-api'; // UserResource

import User from 'ember-osf-web/models/user';

import ApplicationSerializer from './application';

interface RootObject {
    activeFlags: string[];
    message: string;
    version: string;
    links: Links;
    currentUser: ModelInstance<User>;
}

export default class RootSerializer extends ApplicationSerializer {
    serialize(object: ModelInstance<RootObject>) {
        const data: RootDocument = {
            meta: {
                activeFlags: object.activeFlags,
                message: object.message,
                version: object.version,
            },
            links: object.links,
        };
        return data;
    }
}

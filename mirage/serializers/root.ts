import { ModelInstance } from 'ember-cli-mirage';
import DS from 'ember-data';
import { Links } from 'jsonapi-typescript';
import { RootDocument } from 'osf-api'; // UserResource

import User from 'ember-osf-web/models/user';

import ApplicationSerializer from './application';

interface RootObject extends DS.Model {
    activeFlags: string[];
    message: string;
    version: string;
    links: Links;
    currentUser?: ModelInstance<User>;
    _withAnonymizedVOL?: boolean;
}

export default class RootSerializer extends ApplicationSerializer<RootObject> {
    serialize(object: ModelInstance<RootObject>) {
        const data: RootDocument = {
            meta: {
                active_flags: object.activeFlags,
                message: object.message,
                version: object.version,
            },
            links: object.links,
        };
        return data;
    }
}

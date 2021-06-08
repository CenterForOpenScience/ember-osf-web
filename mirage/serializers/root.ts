import Model from '@ember-data/model';
import { ModelInstance } from 'ember-cli-mirage';
import { Links } from 'jsonapi-typescript';
import { RootDocument } from 'osf-api'; // UserResource

import User from 'ember-osf-web/models/user';

import ApplicationSerializer from './application';

interface RootObject extends Model {
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

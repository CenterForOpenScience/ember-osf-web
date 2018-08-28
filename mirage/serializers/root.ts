import config from 'ember-get-config';
import { Links } from 'jsonapi-typescript';
import { RootDocument } from 'osf-api';

import User from 'ember-osf-web/models/user';

import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

interface RootObject {
    activeFlags: string[];
    message: string;
    version: string;
    links: Links;
    currentUser: User;
}

export default class RootSerializer extends ApplicationSerializer {
    serialize(object: RootObject) {
        const data: RootDocument = {
            meta: {
                activeFlags: object.activeFlags,
                message: object.message,
                version: object.version,
            },
            links: object.links,
        };
        if (object.currentUser) {
            // When we fix links in the application serializer, replace this with a serialization of the user
            data.meta.current_user = {
                data: {
                    relationships: {
                        nodes: {
                            links: {
                                related: {
                                    href: `${apiUrl}/v2/users/${object.currentUser.id}/nodes/`,
                                    meta: this.buildRelatedLinkMeta(object.currentUser, 'nodes'),
                                },
                            },
                        },
                    },
                    attributes: {
                        accepted_terms_of_service: object.currentUser.acceptedTermsOfService ?
                            object.currentUser.acceptedTermsOfService : false,
                        full_name: object.currentUser.fullName,
                        given_name: object.currentUser.givenName,
                        family_name: object.currentUser.familyName,
                        suffix: object.currentUser.suffix,
                        locale: object.currentUser.locale,
                        middle_names: object.currentUser.middleNames,
                        social: object.currentUser.social,
                        active: object.currentUser.active,
                        timezone: object.currentUser.timezone,
                    },
                    links: {
                        self: `/v2/users/${object.currentUser.id}/`,
                        profile_image: object.currentUser.profileImage,
                    },
                    type: 'users',
                    id: object.currentUser.id,
                },
            };
        }
        return data;
    }
}

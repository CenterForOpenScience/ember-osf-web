import config from 'ember-get-config';
import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

export default ApplicationSerializer.extend({
    serialize(object) {
        const data = {
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
                                    meta: {},
                                },
                            },
                        },
                    },
                    attributes: {
                        accepted_terms_of_service: object.currentUser.acceptedTermsOfService,
                        full_name: object.currentUser.fullName,
                        given_name: object.currentUser.givenName,
                        last_name: object.currentUser.lastName,
                        suffix: object.currentUser.suffix,
                        locale: object.currentUser.locale,
                        middle_names: object.currentUser.middleNames,
                        social: object.currentUser.social,
                        active: object.currentUser.active,
                        timezone: object.currentUser.timezone,
                    },
                    links: {
                        self: `/v2/users/${object.currentUser.attrs.id}/`,
                        profile_image: object.currentUser.profileImage,
                    },
                    type: 'users',
                    id: object.currentUser.id,
                },
            };
        }
        return data;
    },
});

import { HandlerContext, ModelInstance, Request, Response, Schema } from 'ember-cli-mirage';
import { Permission } from 'ember-osf-web/models/osf-model';
import PreprintModel from 'ember-osf-web/models/preprint';
import faker from 'faker';

import { guid } from '../factories/utils';


export function createPreprint(this: HandlerContext, schema: Schema) {
    const now = new Date();
    const randomNum = faker.random.number();
    const preprintGuid = guid('preprint');
    const id = preprintGuid(randomNum);

    const attrs = {
        ...this.normalizedRequestAttrs('preprint'),
        id,
        dateModified: now,
        dateCreated: now,
        isPublished: false,
        originalPublicationDate: null,
        dateLastTransitioned: null,
        hasCoi: null,
        conflictOfInterestStatement: null,
        hasDataLinks: null,
        whyNoData: null,
        dataLinks: null,
        preregLinks: null,
        preregLinkInfo: null,
        hasPreregLinks: null,
        doi: null,
        dateWithdrawn: null,
        public: false,
        citation: null,
        subjects: [],
        tags: [] as string[] ,
        currentUserPermission: [Permission.Admin, Permission.Read, Permission.Write],
    };
    const preprint = schema.preprints.create(attrs) as ModelInstance<PreprintModel>;


    const userId = schema.roots.first().currentUserId;

    if (userId) {
        const currentUser = schema.users.find(userId);
        const contributor = schema.contributors.create({
            preprint,
            users: currentUser,
            index: 0,
            permission: Permission.Admin,
            bibliographic: true,
        });

        preprint.bibliographicContributors.models.push(contributor);
        preprint.save();
    }

    const providerId = preprint.id + ':osfstorage';
    schema.fileProviders.create({ id: providerId, target: preprint });
    preprint.save();

    return preprint;
}

export function updatePreprint(this: HandlerContext, schema: Schema, request: Request) {
    const resource = schema.resources.find(request.params.id);
    const attributes = {
        ...this.normalizedRequestAttrs('resource'),
    };
    if ('pid' in attributes) {
        if (!attributes.pid || !attributes.pid.startsWith('10.')) {
            return new Response(400, {}, {
                errors: [{
                    status: '400',
                    detail: 'invalid doi',
                    source: {pointer: '/data/attributes/pid'},
                }],
            });
        }
    }
    resource.update(attributes);
    return this.serialize(resource);
}

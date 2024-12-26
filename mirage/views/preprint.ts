import { HandlerContext, ModelInstance, Request, Response, Schema } from 'ember-cli-mirage';
import { Permission } from 'ember-osf-web/models/osf-model';
import PreprintModel from 'ember-osf-web/models/preprint';
import { ReviewsState } from 'ember-osf-web/models/provider';
import faker from 'faker';

import { guid } from '../factories/utils';
import { process } from './utils';


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
        versionNumber: 1,
        isLatestVersion: true,
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

export function getPreprintVersions(this: HandlerContext, schema: Schema) {
    const preprintId = this.request.params.id as string;
    const baseId = preprintId.split('_v')[0]; // assumes preprint id is of the form <baseId>_v<versionNumber>
    const preprints = schema.preprints.all().models
        .filter((preprint: ModelInstance<PreprintModel>) => preprint.id !== baseId && preprint.id.includes(baseId));
    const versions = preprints.sortBy('versionNumber').reverse();
    return process(schema, this.request, this,
        versions.map((version: ModelInstance) => this.serialize(version).data));
}

export function createPreprintVersion(this: HandlerContext, schema: Schema) {
    const basePreprintId = this.request.params.id as string;
    const basePreprint = schema.preprints.find(basePreprintId);
    basePreprint.update({ isLatestVersion: false });
    const baseVersionNumber = basePreprint.version || 1;
    const providerModeration = basePreprint.provider && basePreprint.provider.reviewsWorkflow;
    const newVersion = schema.preprints.create({
        ...basePreprint.attrs,
        reviewsState: providerModeration ? ReviewsState.PENDING : ReviewsState.ACCEPTED,
        id: basePreprintId.split('_v')[0] + '_v' + (baseVersionNumber + 1),
        versionNumber: baseVersionNumber + 1,
        isLatestVersion: true,
    });
    return this.serialize(newVersion);
}

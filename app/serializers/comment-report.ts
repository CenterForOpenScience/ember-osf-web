import DS from 'ember-data';
import getHref from 'ember-osf-web/utils/get-href';
import { Resource, ResourceCollectionDocument, SingleResourceDocument } from 'osf-api';
import OsfSerializer from './osf-serializer';

function normalizeId(resource: Resource): string {
    const resourceLink = getHref(resource.links!.self!);
    const commentId = resourceLink.split('/').reverse()[2];
    const resourceId = resource.id;
    return `${resourceId}-${commentId}-${Date.now()}`;
}

export default class CommentReportSerializer extends OsfSerializer {
    // Upon creating a report the api returns report object with id corresponding
    // to currentUser id. Problematic since the currentUser can create
    // 1) multiple reports on a comment (given they retract their report and then resubmit);
    // 2) multiple reports on multiple comments.
    // Ember Data hates both cases.
    // Workaround: we normalize the ID into unique id. The backend api does not care about this new report ID.

    normalizeSingleResponse(
        store: DS.Store,
        primaryModelClass: any,
        payload: SingleResourceDocument,
        id: string,
        requestType: string,
    ): any {
        if (payload.data.id) {
            payload.data.id = normalizeId(payload.data); // eslint-disable-line no-param-reassign
        }
        return super.normalizeSingleResponse(store, primaryModelClass, payload, id, requestType);
    }

    normalizeArrayResponse(
        store: DS.Store,
        primaryModelClass: any,
        payload: ResourceCollectionDocument,
        id: string,
        requestType: string,
    ): any {
        payload.data.forEach((resource: Resource) => {
            resource.id = normalizeId(resource); // eslint-disable-line no-param-reassign
        });
        return super.normalizeArrayResponse(store, primaryModelClass, payload, id, requestType);
    }
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'comment-report': CommentReportSerializer;
    } // eslint-disable-line semi
}

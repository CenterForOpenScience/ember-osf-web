import DS from 'ember-data';
import OsfAdapter from './osf-adapter';

export default class MeetingSubmissionAdapter extends OsfAdapter {
    namespace = '_/meetings';
    buildUrl(_: 'meeting-submission', __: string, ___: DS.Snapshot, requestType: string, query: any) {
        if (requestType === 'query') {
            return this.urlForQuery(query);
        }

        throw new Error('meeting-submission endpoint only supports query.');
    }

    urlForQuery(query: any) {
        if (query.meetingId) {
            const { meetingId } = query;
            // need to delete query.meetingId so that it doesn appear as a query param in url
            // eslint-disable-next-line no-param-reassign
            delete query.meetingId;
            return `${this.host}/${this.namespace}/${meetingId}/submissions/`;
        }

        throw new Error('Must provide a meetingId when querying for submissions');
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'meeting-submission': MeetingSubmissionAdapter;
    } // eslint-disable-line semi
}

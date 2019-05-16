import DS from 'ember-data';
import OsfAdapter from './osf-adapter';

export default class MeetingSubmissionsAdapter extends OsfAdapter {
    namespace = '_/meetings';
    buildUrl(_: 'meeting-submissions', __: string, ___: DS.Snapshot, requestType: string, query: any) {
        if (requestType === 'query') {
            return this.urlForQuery(query);
        }

        throw new Error('meeting-submissions endpoint only supports query.');
    }

    urlForQuery(query: any) {
        if (query.meetingId) {
            const { meetingId } = query;
            return `${this.host}/${this.namespace}/${meetingId}/submissions/`;
        }

        throw new Error('Must provide a meetingId when querying for submissions');
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'meeting-submissions': MeetingSubmissionsAdapter;
    } // eslint-disable-line semi
}

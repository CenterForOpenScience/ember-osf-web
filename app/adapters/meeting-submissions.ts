import OsfAdapter from './osf-adapter';
import DS from 'ember-data';

export default class MeetingSubmissionsAdapter extends OsfAdapter {
    namespace = '_/meetings'
    buildUrl(_modelName: 'meeting-submissions', _id: string, _snapshot: DS.Snapshot, requestType: string, query: any) {
        if (requestType === 'query') {
            return this.urlForQuery(query);
        } else {
            throw new Error('meeting-submissions endpoint only supports query.')
        }
    }

    urlForQuery(query: any) {
        if (query.meetingId) {
            const meetingId = query.meetingId;
            delete query.meetingId;
            return `${this.host}/${this.namespace}/${meetingId}/submissions/`;
        } else {
            throw new Error('Must provide a meetingId when querying for submissions');
        }
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'meeting-submissions': MeetingSubmissionsAdapter;
    } // eslint-disable-line semi
}

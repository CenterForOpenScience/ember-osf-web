// import DS from 'ember-data';
import OsfAdapter from './osf-adapter';

export default class MeetingSubmissionAdapter extends OsfAdapter {
    parentRelationship = 'meetings';
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'meeting-submission': MeetingSubmissionAdapter;
    } // eslint-disable-line semi
}

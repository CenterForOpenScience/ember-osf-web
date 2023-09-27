import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-osf-web/config/environment';
import MeetingSubmission from 'ember-osf-web/models/meeting-submission';
import ApplicationSerializer from './application';

const { OSF: { url } } = config;

export default class MeetingSubmissionSerializer extends ApplicationSerializer<MeetingSubmission> {
    buildNormalLinks(model: ModelInstance<MeetingSubmission>) {
        return {
            self: 'fakeUrl',
            html: `${url}${model.id}`,
            download: 'fakeDownloadUrl',
        };
    }
}

import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import CommentReport from 'ember-osf-web/models/comment-report';
import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

export default class CommentReportSerializer extends ApplicationSerializer<CommentReport> {
    buildRelationships(model: ModelInstance<CommentReport>) {
        return {
            comment: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/comments/${model.comment.id}/`,
                        meta: {},
                    },
                },
            },
        };
    }
    buildNormalLinks(model: ModelInstance<CommentReport>) {
        return {
            self: `${apiUrl}/v2/comments/${model.comment.id}/reports/${model.reporter}`,
        };
    }
}

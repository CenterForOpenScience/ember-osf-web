import { association, Factory, faker } from 'ember-cli-mirage';

import CommentReport from 'ember-osf-web/models/comment-report';

import { guid } from './utils';

export default Factory.extend<CommentReport>({
    id: guid('comment-report'),
    afterCreate(commentReport, server) {
        const root = server.schema.roots.first();
        const reporter = (!root || faker.random.boolean()) ? server.create('user').id : root.currentUser!.id;
        commentReport.update({
            reporter,
        });

        const comment = server.schema.comments.find(commentReport.comment.id);
        if (comment) {
            comment.update({
                isAbuse: true,
                hasReport: !root || root.currentUser!.id === reporter,
            });
        }
    },
    category: faker.list.cycle('spam', 'hate', 'violence'),
    message: faker.lorem.sentences(2),

    comment: association() as CommentReport['comment'],
});

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        commentReports: CommentReport;
    } // eslint-disable-line semi
}

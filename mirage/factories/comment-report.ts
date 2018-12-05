import { association, Factory, faker, ModelInstance } from 'ember-cli-mirage';

import CommentReport from 'ember-osf-web/models/comment-report';
import { guid } from './utils';

export default Factory.extend<CommentReport>({
    id: guid('comment-report'),
    afterCreate(commentReport: ModelInstance<CommentReport>, server: any) {
        const reporter = commentReport.comment.user.id;
        commentReport.update({
            reporter,
        });

        const comment = server.schema.comments.find(commentReport.comment.id);
        const { currentUserId } = server.schema.roots.first();
        if (comment) {
            comment.update({
                isAbuse: true,
                hasReport: currentUserId === reporter,
            });
        }
    },
    category: faker.list.cycle('spam', 'hate', 'violence'),
    message: faker.lorem.sentences(2),

    comment: association() as CommentReport['comment'],
});

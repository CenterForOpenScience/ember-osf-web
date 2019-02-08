import { association, Factory, faker } from 'ember-cli-mirage';

import Comment from 'ember-osf-web/models/comment';
import CommentReport from 'ember-osf-web/models/comment-report';

import { Root } from './root';
import { guid } from './utils';

export default Factory.extend<CommentReport>({
    id: guid('comment-report'),
    afterCreate(commentReport, server) {
        const root = server.schema.roots.first<Root>();
        const reporter = (!root || faker.random.boolean()) ? server.create('user').id : root.currentUser!.id;
        commentReport.update({
            reporter,
        });

        const comment = server.schema.comments.find<Comment>(commentReport.comment.id);
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

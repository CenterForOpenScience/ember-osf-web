import { association, Factory, faker, ModelInstance } from 'ember-cli-mirage';

import CommentReport from 'ember-osf-web/models/comment-report';
import { guid } from './utils';

export default Factory.extend<CommentReport>({
    id: guid('comment-report'),
    afterCreate(commentReport: ModelInstance<CommentReport>, server: any) {
        const { currentUser } = server.schema.roots.first();
        const reporter = faker.random.boolean() ? server.create('user').id : currentUser.id;
        commentReport.update({
            reporter,
        });

        const comment = server.schema.comments.find(commentReport.comment.id);
        if (comment) {
            comment.update({
                isAbuse: true,
                hasReport: currentUser.id === reporter,
            });
        }
    },
    category: faker.list.cycle('spam', 'hate', 'violence'),
    message: faker.lorem.sentences(2),

    comment: association() as CommentReport['comment'],
});

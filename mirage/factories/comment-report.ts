import { association, Factory, faker, ModelInstance} from 'ember-cli-mirage';

import CommentReport from 'ember-osf-web/models/comment-report';
import { guid } from './utils';

export default Factory.extend<CommentReport>({
    id: guid('comment-report'),
    afterCreate(commentReport: ModelInstance<CommentReport>) {
        commentReport.update({
            reporter: commentReport.comment.user.id,
        });
    },
    category: faker.list.cycle('spam', 'hate', 'violence'),
    message: faker.lorem.sentences(2),

    comment: association() as CommentReport['comment'],
});

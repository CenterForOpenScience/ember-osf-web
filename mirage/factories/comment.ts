import { association, Factory, faker, ModelInstance, trait, Trait } from 'ember-cli-mirage';

import Comment from 'ember-osf-web/models/comment';
import { guid } from './utils';

export interface CommentTraits {
    withReplies: Trait;
    asAbuse: Trait;
}

export default Factory.extend<Comment & CommentTraits>({
    id: guid('comment'),
    node: association() as Comment['node'],
    user: association() as Comment['user'],

    afterCreate(comment: ModelInstance<Comment>) {
        if (!comment.targetID && !comment.targetType) {
            comment.update({
                targetID: comment.node.id,
                targetType: comment.node.nodeType,
            });
        }
    },
    page: 'node',
    content() {
        return faker.lorem.sentences(faker.random.number({ min: 1, max: 4 }));
    },
    dateCreated() {
        return faker.date.past(3);
    },
    dateModified() {
        return faker.date.past(3);
    },
    modified: false,
    deleted: false,
    canEdit: true,
    hasReport: false,
    isAbuse: false,
    isHam: false,
    targetID: '',
    targetType: '',

    withReplies: trait({
        afterCreate(comment: any, server: any) {
            const count = faker.random.number({ min: 0, max: 1 });
            const replies = server.createList(
                'comment',
                count,
                { node: comment.node, targetID: comment.id, targetType: 'comments' },
            );
            comment.update({ replies });
        },
    }),

    asAbuse: trait({
        afterCreate(comment: any, server: any) {
            server.create('comment-report', { comment });
        },
    }),
});

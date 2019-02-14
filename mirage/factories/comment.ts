import { association, Factory, faker, trait, Trait } from 'ember-cli-mirage';

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

    afterCreate(comment) {
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
    hasChildren: false,

    withReplies: trait<Comment>({
        afterCreate(comment, server) {
            const siblings = server.schema.comments.where({ targetID: comment.targetID });
            const count = faker.random.number({ min: 0, max: siblings.length - 1 });

            server.createList(
                'comment',
                count,
                { node: comment.node, targetID: comment.id, targetType: 'comments' },
                'withReplies',
            );

            if (count) {
                comment.update({
                    hasChildren: true,
                });
            }
        },
    }),

    asAbuse: trait<Comment>({
        afterCreate(comment, server) {
            server.create('comment-report', { comment });
        },
    }),
});

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        comments: Comment;
    } // eslint-disable-line semi
}

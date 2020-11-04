import { association, Factory, Trait, trait } from 'ember-cli-mirage';

import Moderator, { PermissionGroup } from 'ember-osf-web/models/moderator';

interface ModeratorTraits {
    asAdmin: Trait;
    asModerator: Trait;
}

export default Factory.extend<Moderator & ModeratorTraits>({
    permissionGroup: PermissionGroup.Moderator,
    user: association() as Moderator['user'],

    asAdmin: trait({ permissionGroup: PermissionGroup.Admin }),
    asModerator: trait({ permissionGroup: PermissionGroup.Moderator }),
    afterCreate(moderator) {
        moderator.user.update({ canViewReviews: true });
    },
});

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        moderators: Moderator;
    } // eslint-disable-line semi
}

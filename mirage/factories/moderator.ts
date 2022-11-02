import { association, Factory, Trait, trait } from 'ember-cli-mirage';

import Moderator, { PermissionGroup } from 'ember-osf-web/models/moderator';

interface ModeratorTraits {
    asAdmin: Trait;
    asModerator: Trait;
}

export default Factory.extend<Moderator & ModeratorTraits>({
    permissionGroup: PermissionGroup.Moderator,

    // associated user must have the same id as the moderator
    user: association() as Moderator['user'],

    asAdmin: trait({ permissionGroup: PermissionGroup.Admin }),
    asModerator: trait({ permissionGroup: PermissionGroup.Moderator }),
    afterCreate(moderator) {
        moderator.user.update({ canViewReviews: true });
        moderator.update({ fullName: moderator.user.fullName });
    },
});

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        moderators: Moderator;
    } // eslint-disable-line semi
}

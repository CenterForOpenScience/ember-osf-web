import { association, Factory, Trait, trait } from 'ember-cli-mirage';

import Moderator, { PermissionGroup } from 'ember-osf-web/models/moderator';

interface ModeratorTraits {
    asAdmin: Trait;
}

export default Factory.extend<Moderator & ModeratorTraits>({
    afterCreate(newModerator) {
        if (newModerator.user) {
            newModerator.update({
                id: newModerator.user.id,
                fullName: newModerator.user.fullName,
            });
        }
    },

    permissionGroup: PermissionGroup.Moderator,
    user: association() as Moderator['user'],

    asAdmin: trait({ permissionGroup: PermissionGroup.Admin }),
});

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        moderator: Moderator;
    } // eslint-disable-line semi
}

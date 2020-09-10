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
});

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        moderator: Moderator;
    } // eslint-disable-line semi
}

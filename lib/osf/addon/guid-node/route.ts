import { TaskInstance } from 'ember-concurrency';

import { ReferentModel } from 'ember-osf-web/models/guid';
import ResolvedGuidRoute from 'osf/resolve-guid/resolved-guid-route';

export interface GuidNodeModel {
    taskInstance: TaskInstance<ReferentModel>;
    nodeId: string;
}

export default class GuidNode extends ResolvedGuidRoute {
    model(this: GuidNode, params: { node_guid: string }): GuidNodeModel {
        return {
            taskInstance: this.get('resolveGuid').perform(
                params.node_guid,
                'node',
                {
                    related_counts: 'forks,registrations,draft_registrations',
                    include: 'root',
                },
            ),
            nodeId: params.node_guid,
        };
    }
}

import NodeModel from 'ember-osf-web/models/node';

export interface HierarchicalListManager {
    nodesIncludingRoot: NodeModel[];
    selectedNodes: NodeModel[];
    onChange: (event: Event, node: NodeModel) => void;
    isChecked: (node: NodeModel) => boolean;
}

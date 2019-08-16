import NodeModel from 'ember-osf-web/models/node';

export interface HierarchicalListManager {
    nodesIncludingRoot: NodeModel[];
    selectedNodes: NodeModel[];
    rootNode: NodeModel;
    addNode: (node: NodeModel) => void;
    removeNode: (node: NodeModel) => void;
    onChange: (event: Event, node: NodeModel) => void;
    isChecked: (node: NodeModel) => boolean;
}

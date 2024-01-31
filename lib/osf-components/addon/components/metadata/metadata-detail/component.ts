import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive';
import NodeModel from 'ember-osf-web/models/node';

interface DetailArgs {
    target: NodeModel;
    displayFileMetadata: boolean;
    route: string;
}

export default class MetadataDetails extends Component<DetailArgs> {
    @service media!: Media;

    public get hasWritePermission(): boolean {
        const node = this.args.target as NodeModel;
        if (node.get('modelName') === 'file') {
            return (node as any).get('target').get('userHasWritePermission');
        } else {
            return node.get('userHasWritePermission');
        }
    }

    get isMobile() {
        return this.media.isMobile;
    }
}

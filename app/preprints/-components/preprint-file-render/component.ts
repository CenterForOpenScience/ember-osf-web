import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import FileModel from 'ember-osf-web/models/file';
import PreprintProviderModel from 'ember-osf-web/models/preprint-provider';
import PreprintModel from 'ember-osf-web/models/preprint';
import Theme from 'ember-osf-web/services/theme';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';
import { taskFor } from 'ember-concurrency-ts';
import FileVersionModel from 'ember-osf-web/models/file-version';
import Media from 'ember-responsive';


interface InputArgs {
    preprint: PreprintModel;
    provider: PreprintProviderModel;
    primaryFile: FileModel;
}

export interface VersionModel extends FileVersionModel {
    downloadUrl?: string;
}

export default class PreprintFileRender extends Component<InputArgs> {
    @service theme!: Theme;
    @service media!: Media;

    @tracked allowCommenting = false;
    @tracked primaryFileHasVersions = false;
    @tracked fileVersions: VersionModel[] = [];

    constructor(owner: unknown, args: InputArgs) {
        super(owner, args);

        taskFor(this.loadPrimaryFileVersions).perform();

        this.allowCommenting = this.args.provider.allowCommenting
            && this.args.preprint.isPublished && this.args.preprint.public;
    }

    @task
    @waitFor
    private async loadPrimaryFileVersions()  {
        const primaryFileVersions = (await this.args.primaryFile.queryHasMany('versions', {
            sort: '-id', 'page[size]': 50,
        })).toArray();
        this.serializeVersions(primaryFileVersions);
        this.primaryFileHasVersions = primaryFileVersions.length > 0;
    }

    private serializeVersions(versions: FileVersionModel[]) {
        const downloadUrl = this.args.primaryFile.links.download as string || '';

        versions.map((version: VersionModel) => {
            const dateFormatted = encodeURIComponent(version.dateCreated.toISOString());
            const displayName = version.name.replace(/(\.\w+)?$/, ext => `-${dateFormatted}${ext}`);

            this.fileVersions.push(
                {
                    name: version.name,
                    id: version.id,
                    dateCreated: version.dateCreated,
                    downloadUrl: `${downloadUrl}?version=${version.id}&displayName=${displayName}`,
                } as VersionModel,
            );
            return version;
        });
    }

    get isMobile() {
        return this.media.isMobile;
    }
}

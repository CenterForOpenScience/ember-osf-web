import Component from '@glimmer/component';
import LogModel from 'ember-osf-web/models/log';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import { tracked } from '@glimmer/tracking';


interface ActivityLogDisplayArgs {
    log: LogModel;
}

interface ParamModel {
    fullName: string;
    license: string;
    node: string;
    path: string;
    pathType: string;
    tag: string;
}

export default class ActivityLogDisplayComponent extends Component<ActivityLogDisplayArgs> {
    @service intl!: Intl;
    @tracked activityDisplay = '';
    @tracked log: LogModel;

    constructor(owner: unknown, args: ActivityLogDisplayArgs) {
        super(owner, args);
        this.log = args.log;
    }

    private buildParam(log: LogModel): ParamModel {
        return {
            fullName: this.log.user.get('fullName'),
            node: log.params.paramsNode.title,
            license: log.params.license,
            path: log.params.path,
            pathType: log.params.pathType,
            tag: log.params.tag,
        };
    }

    /**
     * Get the activity
     */
    get activity(): string {
        const logParams = this.buildParam(this.log);

        return this.intl.t(`activity-log.activities.${this.log?.action}`, {
            license: logParams.license,
            node: logParams.node,
            path: logParams.path,
            path_type: logParams.pathType,
            tag: logParams.tag,
            user: logParams.fullName,
            /*
            addon: null,
            anonymous_link: null,
            comment_location: null,
            contributors: null,
            destination: null,
            forked_from: null,
            group: null,
            guid: null,
            identifiers: null,
            institution: null,
            kind: null,
            new_identifier: null,
            obsolete_identifier: null,
            old_page: null,
            page: null,
            pointer: null,
            pointer_category: null,
            preprint: null,
            preprint_provider: null,
            source: null,
            template: null,
            title_new: null,
            title_original: null,
            updated_fields: null,
            value: null,
            version: null,
            */
            htmlSafe: true,

        }) as string;
    }
}

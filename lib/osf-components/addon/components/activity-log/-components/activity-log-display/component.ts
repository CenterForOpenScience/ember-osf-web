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
    node: string;
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
            node: log.params.params_node.title,
            fullName: this.log.user.get('fullName'),
        };
    }

    /**
     * Get the activity
     */
    get activity(): string {
        const logParams = this.buildParam(this.log);

        return this.intl.t(`activity-log.activities.${this.log?.action}`, {
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
            license: null,
            new_identifier: null,
            node: logParams.node,
            obsolete_identifier: null,
            old_page: null,
            page: null,
            path: null,
            path_type: null,
            pointer: null,
            pointer_category: null,
            preprint: null,
            preprint_provider: null,
            source: null,
            tag: null,
            template: 'The template',
            title_new: null,
            title_original: null,
            updated_fields: null,
            user: logParams.fullName,
            value: null,
            version: null,
            htmlSafe: true,
        }) as string;
    }
}

import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import { ValidationObject } from 'ember-changeset-validations';

import buildChangeset from 'ember-osf-web/utils/build-changeset';
import { validateUrlWithProtocols } from 'ember-osf-web/validators/url-with-protocol';
import { tracked } from '@glimmer/tracking';


/**
 * The Data Link Args
 */
interface LinkArgs {
    remove: (__:number) => {};
    update: (_: string, __:number) => {};
    disabled: boolean;
    value: string;
    placeholder: string;
    index: number;
}

interface LinkForm {
    value: string;
}

/**
 * The Data Link Component
 */
export default class Link extends Component<LinkArgs>{
    @service intl!: Intl;
    @tracked linkFormChangeset: any = null;

    linkFormValidation: ValidationObject<LinkForm> = {
        value: validateUrlWithProtocols({
            translationArgs: { description: this.intl.t('validationErrors.description') },
        }),
    };

    @action
    initializeChangeset() {
        this.linkFormChangeset = buildChangeset(
            {value: this.args.value || undefined},
            this.linkFormValidation,
        );

        this.onUpdate();
    }

    @action
    public async onUpdate(): Promise<void> {
        this.linkFormChangeset.validate();
        if (this.linkFormChangeset.isInvalid) {
            this.args.update('', this.args.index);
            return;
        }
        this.linkFormChangeset.execute();
        await this.args.update(this.linkFormChangeset.get('value'), this.args.index);
    }

    @action
    public async removeLink(): Promise<void> {
        await this.args.remove(this.args.index);
    }
}

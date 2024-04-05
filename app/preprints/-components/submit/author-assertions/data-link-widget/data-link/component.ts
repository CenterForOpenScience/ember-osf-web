import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import { ValidationObject } from 'ember-changeset-validations';
import { validatePresence } from 'ember-changeset-validations/validators';
import buildChangeset from 'ember-osf-web/utils/build-changeset';


/**
 * The Data Link Args
 */
interface DataLinkArgs {
    remove: (__:number) => {};
    update: (_: string, __:number) => {};
    value: string;
    index: number;
}


interface DataLinkForm {
    value: string;
}

const DataLinkFormValidation: ValidationObject<DataLinkForm> = {
    value: validatePresence({
        presence: true,
        ignoreBlank: false,
        type: 'empty',
    }),
};

/**
 * The Data Link Component
 */
export default class DataLink extends Component<DataLinkArgs>{
    @service intl!: Intl;


    dataLinkFormChangeset = buildChangeset(
        {value: this.args.value || undefined},
        DataLinkFormValidation,
    );

    @action
    public async onUpdate(): Promise<void> {
        this.dataLinkFormChangeset.validate();
        if (this.dataLinkFormChangeset.isInvalid) {
            this.args.update('', this.args.index);
            return;
        }
        this.dataLinkFormChangeset.execute();
        await this.args.update(this.dataLinkFormChangeset.get('value'), this.args.index);
    }

    @action
    public async removeLink(): Promise<void> {
        await this.args.remove(this.args.index);
    }
}

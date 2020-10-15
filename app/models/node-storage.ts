import { computed } from '@ember/object';
import DS from 'ember-data';

import OsfModel from './osf-model';

const { attr } = DS;

export const TestCases: Record<'public' | 'private', Record<StorageStatus, { warning: boolean, error: boolean }>> = {
    public: {
        DEFAULT: {
            warning: false,
            error: false,
        },
        APPROACHING_PRIVATE: {
            warning: false,
            error: false,
        },
        OVER_PRIVATE: {
            warning: false,
            error: false,
        },
        APPROACHING_PUBLIC: {
            warning: true,
            error: false,
        },
        OVER_PUBLIC: {
            warning: false,
            error: true,
        },
        NOT_CALCULATED: {
            warning: false,
            error: false,
        },
    },
    private: {
        DEFAULT: {
            warning: false,
            error: false,
        },
        APPROACHING_PRIVATE: {
            warning: true,
            error: false,
        },
        OVER_PRIVATE: {
            warning: false,
            error: true,
        },
        APPROACHING_PUBLIC: {
            warning: false,
            error: true,
        },
        OVER_PUBLIC: {
            warning: false,
            error: true,
        },
        NOT_CALCULATED: {
            warning: false,
            error: false,
        },
    },
};

export enum StorageStatus {
    DEFAULT = 'DEFAULT',
    APPROACHING_PRIVATE = 'APPROACHING_PRIVATE',
    OVER_PRIVATE = 'OVER_PRIVATE',
    APPROACHING_PUBLIC = 'APPROACHING_PUBLIC',
    OVER_PUBLIC = 'OVER_PUBLIC',
    NOT_CALCULATED = 'NOT_CALCULATED',
}

export default class NodeStorageModel extends OsfModel {
    @attr('string') storageLimitStatus!: StorageStatus;
    @attr('number') storageUsage!: number;

    @computed('id', 'storageLimitStatus')
    get isOverStorageCap() {
        const node = this.store.peekRecord('node', this.id);
        if (node) {
            const status = this.storageLimitStatus;
            if (status === StorageStatus.OVER_PUBLIC) {
                return true;
            }
            if (!node.public) {
                if ([StorageStatus.OVER_PRIVATE, StorageStatus.APPROACHING_PUBLIC].includes(status)) {
                    return true;
                }
            }
        }
        return false;
    }

    @computed('id', 'storageLimitStatus')
    get isApproachingStorageCap() {
        const node = this.store.peekRecord('node', this.id);
        if (node) {
            if (!node.public && (this.storageLimitStatus === StorageStatus.APPROACHING_PRIVATE)) {
                return true;
            }
            if (node.public && (this.storageLimitStatus === StorageStatus.APPROACHING_PUBLIC)) {
                return true;
            }
        }
        return false;
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'node-storage': NodeStorageModel;
    } // eslint-disable-line semi
}

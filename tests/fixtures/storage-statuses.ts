import { StorageStatus } from 'ember-osf-web/models/node-storage';

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

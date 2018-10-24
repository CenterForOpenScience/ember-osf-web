declare module 'ember' {
    namespace Ember {
        class Application extends Engine {
            buildInstance(): ApplicationInstance;
        }
    }
}

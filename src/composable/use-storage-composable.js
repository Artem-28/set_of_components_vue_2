export const useStorage = () => {
    const executors = {};
    const state = {};

    function remove(key) {
        delete executors[key];
        delete state[key];
    }

    async function list() {
        const data = [];

        for (const key in state) {
            const item = await state[key];
            data.push(item)
        }

        return data;
    }

    async function get(key) {
        const has = Object.prototype.hasOwnProperty.call(state, key);
        if (has) return state[key];

        const executor = {};

        const promise = new Promise((resolve, reject) => {
            executor.resolve = resolve;
            executor.reject = reject;
        }).catch(() => {
            remove(key)
        });

        state[key] = promise;
        executors[key] = executor;

        return promise;
    }

    function save(key, item) {
        const { resolve } = executors[key] || {}

        if (typeof resolve === 'function') {
            resolve(item);
            delete executors[key]
        }

        state[key] = item;
    }

    return { get, save, list, remove, state }
}
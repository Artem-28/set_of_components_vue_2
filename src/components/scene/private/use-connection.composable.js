import { ref } from "vue";

export const useConnection = (scale) => {
    let resolveFn = null;

    const startData = {
        startX: 0,
        startY: 0,
        clientX: 0,
        clientY: 0,
    }

    const fromKey = ref(null);
    const toKey = ref(null);
    const float = ref(null)

    function chooseTarget(e) {
        if (!float.value) return;

        const dx = (e.clientX - startData.clientX) / scale.value;
        const dy = (e.clientY - startData.clientY) / scale.value;

        float.value = {
            x: startData.startX + dx,
            y: startData.startY + dy,
        }
    }

    function complete() {
        if (!fromKey.value || !toKey.value) {
            resolveFn(null);
            return;
        }

        const key = `${fromKey.value}_${toKey.value}`;
        const relation = {
            key,
            fromKey: fromKey.value,
            toKey: toKey.value,
        };

        resolveFn(relation);

    }

    function stop() {
        complete();
        float.value = null;
        fromKey.value = null;
        toKey.value = null;
        startData.clientX = 0;
        startData.clientY = 0;
        startData.startX = 0;
        startData.startY = 0;
        window.removeEventListener("pointermove", chooseTarget)
        window.removeEventListener("pointerup", stop)


    }

    function start(fromData) {
        startData.clientX = fromData.cx;
        startData.clientY = fromData.cy;
        startData.startX = fromData.x;
        startData.startY = fromData.y;

        float.value = { x: fromData.x, y: fromData.y };
        fromKey.value = fromData.key;

        window.addEventListener("pointermove", chooseTarget);
        window.addEventListener("pointerup", stop);

        return new Promise((resolve) => {
            resolveFn = resolve;
        })
    }

    function updateTarget(key = null) {
        toKey.value = key;
    }

    return {
        fromKey,
        toKey,
        float,
        start,
        updateTarget,
    }
}
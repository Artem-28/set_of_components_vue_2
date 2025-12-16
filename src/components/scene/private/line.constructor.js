export function line(start) {
    const r = 100;
    const points = [{ ...start }]

    function last() {
        return points[points.length - 1]
    }

    function drawX(dx) {
        if (dx === 0) return this
        const p = last()
        points.push({ x: p.x + dx, y: p.y })
        return this
    }

    function drawY(dy) {
        if (dy === 0) return this
        const p = last()
        points.push({ x: p.x, y: p.y + dy })
        return this
    }

    function draw(dx, dy) {
        if (dx === 0 && dy === 0) return this;
        const p = last()
        points.push({ x: p.x + dx, y: p.y + dy })
        return this
    }

    function build() {
        if (points.length < 2) return ''

        let d = `M ${points[0].x} ${points[0].y}`

        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1]
            const curr = points[i]
            const next = points[i + 1]

            // Последний сегмент — без скругления
            if (!next) {
                d += ` L ${curr.x} ${curr.y}`
                continue
            }

            const fdx = curr.x - prev.x
            const fdy = curr.y - prev.y
            const tdx = next.x - curr.x
            const tdy = next.y - curr.y

            const fromLen = Math.abs(fdx + fdy)
            const toLen = Math.abs(tdx + tdy)

            const radius = Math.min(r, fromLen / 2, toLen / 2)

            // Точка входа в скругление
            const fx = curr.x - Math.sign(fdx) * radius
            const fy = curr.y - Math.sign(fdy) * radius

            // Точка выхода из скругления
            const tx = curr.x + Math.sign(tdx) * radius
            const ty = curr.y + Math.sign(tdy) * radius

            d += ` L ${fx} ${fy}`
            d += ` Q ${curr.x} ${curr.y} ${tx} ${ty}`
        }

        return d
    }

    return {
        drawX,
        drawY,
        draw,
        build,
    }
}
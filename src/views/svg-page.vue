<template>
  <svg class="svg-page">
<!--    <circle r="3" fill="red" :cx="from.x" :cy="from.y" />-->
<!--    <circle r="3" fill="green" :cx="tp.x" :cy="tp.y" />-->
<!--    <circle r="3" fill="blue" :cx="to.x" :cy="to.y" />-->
<!--    <circle r="3" :cx="carriage.x" :cy="carriage.y" />-->

<!--    <path fill="none"  stroke="red" stroke-width="3" d="M10 10 L90 10 Q100 10 100 20 L100 90" />-->
    <path fill="none"  stroke="red" stroke-width="3" d="M10 10 L90 10 Q100 10 100 20 L100 90 Q100 100 110 100 L200 100"  />
    <circle r="1" :cx="90" :cy="10" />
    <circle r="1" :cx="100" :cy="10" />
    <circle r="1" :cx="100" :cy="20" />

    <circle r="1" :cx="100" :cy="90" />
    <circle r="1" :cx="100" :cy="100" />
    <circle r="1" :cx="110" :cy="100" />
    <path
        :d="arrow"
        stroke="red"
        stroke-width="3"
        fill="none"
    />
  </svg>
</template>

<script setup>
// https://codepen.io/explosion/pen/YGrpwd
// https://docs.aspose.com/svg/ru/net/drawing-basics/svg-path-data/

const fp = { x: 400, y: 200 };
const tp = { x: 800, y: 400 };

const arrow = line(fp).drawX(100).drawY(100).drawX(-100).drawY(100).build();

function line(start, radius = 12) {
  const r = 12;
  const points = [{ ...start }]

  function last() {
    return points[points.length - 1]
  }

  function drawX(dx) {
    const p = last()
    points.push({ x: p.x + dx, y: p.y })
    return this
  }

  function drawY(dy) {
    const p = last()
    points.push({ x: p.x, y: p.y + dy })
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

      const dx1 = curr.x - prev.x
      const dy1 = curr.y - prev.y
      const dx2 = next.x - curr.x
      const dy2 = next.y - curr.y

      const len1 = Math.abs(dx1 + dy1)
      const len2 = Math.abs(dx2 + dy2)

      const rr = Math.min(r, len1 / 2, len2 / 2)

      // Точка входа в скругление
      const x1 = curr.x - Math.sign(dx1) * rr
      const y1 = curr.y - Math.sign(dy1) * rr

      // Точка выхода из скругления
      const x2 = curr.x + Math.sign(dx2) * rr
      const y2 = curr.y + Math.sign(dy2) * rr

      d += ` L ${x1} ${y1}`
      d += ` Q ${curr.x} ${curr.y} ${x2} ${y2}`
    }

    return d
  }

  return {
    drawX,
    drawY,
    build,
  }
}

// const {
//   from,
//   to,
//   carriage,
//   path
// } = arrow.stop();
//
// function line(from) {
//   const r = 10;
//   const carriage = { ...from };
//   const to = { ...from };
//   let path = ''
//
//   function stop() {
//     let d = `M${from.x} ${from.y}`
//     if (path) d += ` ${path}`;
//
//     // d += ` L${to.x} ${to.y}`;
//     return {
//       from,
//       to,
//       carriage,
//       path: d
//     }
//   }
//
//   function direction(point) {
//     let directionX = 'm';
//     let directionY = 'm';
//     const dx = (carriage.x + point.x) - carriage.x;
//     const dy = (carriage.y + point.y) - carriage.y;
//
//     if (dx > 0) directionX = 'ltr';
//     if (dx < 0) directionX = 'rtl';
//
//     if (dy > 0) directionY = 'ttb';
//     if (dy < 0) directionY = 'btt';
//
//     return { x: directionX, y: directionY };
//   }
//
//   function draw() {
//     path += `L${carriage.x} ${carriage.y}`
//   }
//
//   function moveCarriage(x = 0, y = 0) {
//     carriage.x += x;
//     carriage.y += y;
//   }
//
//   function angle(to) {
//     const { x: directionX, y: directionY } = direction(to);
//     const factorX = directionX === 'rtl' ? 1 : -1;
//     const factorY = directionY === 'ttb' ? 1 : -1;
//
//     const dx = r * factorX;
//     const dy = r * factorY;
//
//     const fx = carriage.x + to.x;
//     const fy = carriage.y;
//
//     const tx = carriage.x + to.x
//     const ty = carriage.y + to.y
//
//     path += `L${fx + dx} ${fy} Q${fx} ${fy} ${fx} ${fy + dy} L${tx} ${ty}`;
//     moveCarriage(to.x, to.y)
//
//     return this
//   }
//
//   function horizontal(to) {
//     const dx = (to.x - carriage.x) / 2;
//     const dy = (to.y - carriage.y) / 2;
//
//     const cx = carriage.x + dx;
//     const cy = carriage.y + dy;
//
//     angle({ x: dx, y: to.y - carriage.y })
//     return this;
//   }
//
//   return {
//     stop,
//     angle,
//     horizontal,
//   }
// }

// function line(from) {
//   const r = 10;
//   const carriage = { ...from };
//   let t = { ...from }
//   let path = `M${from.x} ${from.y}`
//
//   const moveCarriage = (x = 0, y = 0) => {
//     carriage.x += x;
//     carriage.y += y;
//   }
//
//   function draw() {
//     path += ` L${carriage.x} ${carriage.y}`
//   }
//
//   function position(fp, tp) {
//     let posX = 'm';
//     let posY = 'm';
//
//     const w = tp.x - fp.x;
//     const h = tp.y - fp.y;
//
//     if (w > 0) posX = 'l';
//     if (w < 0) posX = 'r';
//
//     if (h > 0) posY = 't';
//     if (h < 0) posY = 'b'
//
//     return { x: posX, y: posY };
//
//   }
//
//   function angle(view) {
//     const factorX = view.x === 'r' ? -1 : 1;
//     const factorY = view.y === 'b' ? -1 : 1;
//
//     const dx = r * factorX;
//     const dy = r * factorY;
//
//     path += ` Q${carriage.x + dx} ${carriage.y} ${carriage.x + dx} ${carriage.y + dy}`
//     moveCarriage(dx, dy)
//   }
//
//   function connection(to) {
//     const pos = position(carriage, to);
//     angle(pos)
//     console.log(carriage, to)
//   }
//
//   function horizontal(to) {
//     t = { ...to }
//     const dx = (to.x - carriage.x) / 2;
//     const dy = (to.y - carriage.y) / 2;
//
//     moveCarriage(dx - r)
//     draw()
//     connection({ x: carriage.x, y: to.y })
//
//     return this
//   }
//
//   const value = () => {
//     return {
//       path,
//       from,
//       to: t,
//       carriage,
//     }
//   }
//
//   return {
//     value,
//     horizontal,
//   }
// }


</script>

<style scoped>
.svg-page {
  width: 100%;
  height: 100%;
  border: 1px solid black;
}

</style>
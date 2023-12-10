<script lang="ts" setup>
import { onMounted } from 'vue'
import type { ILedOptions } from '../../store/interface'

const props = defineProps<
  { ledOptions: ILedOptions }
>()

// 加载完成后操作DOM显示数码数字
onMounted(() => {
  const canvas = document.getElementById('canvas')
  ledSetValue(canvas, props.ledOptions)
})

/*
led数字效果
来自：https://blog.csdn.net/dj_xyp/article/details/104271486
*/
/*
* canvas：需要生成led样式容器的canvas标签对象；例
* options：参数对象
options: {
color:red,-- led灯的颜色，默认orange
width:100,-- led灯的宽度，默认50
height:200,-- led灯的高度，默认100
values:-123.4,-- led需要显示的值，默认0
lineWidth:5,--led灯的线宽，默认5
italics:10 --倾斜角度，默认0
opacity:0.1 --led不发光时的透明度，默认0.1（0<=opacity<1。注意不透明度请不要写1.否则全显示8）
}
*/
function ledSetValue(canvas: any, options: ILedOptions) {
  if (options === null) {
    options = {
      color: 'orange',
      width: 50,
      height: 100,
      values: 0,
      lineWidth: 5,
      italics: 0,
      opacity: 0.1,
    }
  }
  // options各属性初始值
  const {
    color = 'orange',
    width = 50,
    height = 100,
    values = 0,
    lineWidth = 5,
    italics = 0,
    opacity = 0.1,
  } = options
  // 判断传入值是否为“0-9”、“.”、“-”、“:”四种类型
  if (!/^[\d.\-:]*$/.test(values.toString()))
    console.error('传入内容只能为“0-9”、“.”、“-”、“:”四种类型的值')

  const valuesArr = values.toString().split('')
  const commaCount = values.toString().match(/\.|:/g) === null ? 0 : values.toString().match(/\.|:/g)?.length
  const divWidth
    = (valuesArr.length - Number(commaCount)) * width
    + (valuesArr.length - Number(commaCount) - 1) * lineWidth * 0.5
    + (width * 0.5 - 0.5 * lineWidth) * Number(commaCount)

  const ctx = canvas.getContext('2d')
  canvas.setAttribute('width', divWidth)
  canvas.setAttribute('height', height)
  canvas.setAttribute('style', `transform:skewX(${italics}deg)`)
  ctx.lineWidth = lineWidth
  ctx.strokeStyle = color
  let distanceLeft = 0
  for (let i = 0; i < valuesArr.length; i++) {
    const styleLed = setNumber(valuesArr[i], opacity)

    if (valuesArr[i] !== '.' && valuesArr[i] !== ':') {
      ctx.lineCap = 'round'
      // 七段数码管第一段（关于七段数码管详情请百度）
      ctx.beginPath()
      ctx.globalAlpha = styleLed[0]
      ctx.moveTo(1.5 * lineWidth + distanceLeft, 0.5 * lineWidth)
      ctx.lineTo(width - 1.5 * lineWidth + distanceLeft, 0.5 * lineWidth)
      ctx.stroke()
      // 七段数码管第二段
      ctx.beginPath()
      ctx.globalAlpha = styleLed[1]
      ctx.moveTo(width - 0.5 * lineWidth + distanceLeft, 1.5 * lineWidth)
      ctx.lineTo(
        width - 0.5 * lineWidth + distanceLeft,
        height / 2 - lineWidth,
      )
      ctx.stroke()
      // 七段数码管第三段
      ctx.beginPath()
      ctx.globalAlpha = styleLed[2]
      ctx.moveTo(
        width - 0.5 * lineWidth + distanceLeft,
        height / 2 + lineWidth,
      )
      ctx.lineTo(
        width - 0.5 * lineWidth + distanceLeft,
        height - 1.5 * lineWidth,
      )
      ctx.stroke()
      // 七段数码管第四段
      ctx.beginPath()
      ctx.globalAlpha = styleLed[3]
      ctx.moveTo(1.5 * lineWidth + distanceLeft, height - 0.5 * lineWidth)
      ctx.lineTo(
        width - 1.5 * lineWidth + distanceLeft,
        height - 0.5 * lineWidth,
      )
      ctx.stroke()
      // 七段数码管第五段
      ctx.beginPath()
      ctx.globalAlpha = styleLed[4]
      ctx.moveTo(0.5 * lineWidth + distanceLeft, height / 2 + lineWidth)
      ctx.lineTo(0.5 * lineWidth + distanceLeft, height - 1.5 * lineWidth)
      ctx.stroke()
      // 七段数码管第六段
      ctx.beginPath()
      ctx.globalAlpha = styleLed[5]
      ctx.moveTo(0.5 * lineWidth + distanceLeft, 1.5 * lineWidth)
      ctx.lineTo(0.5 * lineWidth + distanceLeft, height / 2 - lineWidth)
      ctx.stroke()
      // 七段数码管第七段
      ctx.beginPath()
      ctx.globalAlpha = styleLed[6]
      ctx.moveTo(1.5 * lineWidth + distanceLeft, height / 2)
      ctx.lineTo(width - 1.5 * lineWidth + distanceLeft, height / 2)
      ctx.stroke()

      distanceLeft += width + 0.5 * lineWidth
    }
    else if (valuesArr[i] === ':') {
      ctx.beginPath()
      ctx.lineCap = 'square'
      ctx.globalAlpha = 1
      ctx.moveTo(
        0.25 * width - 0.5 * lineWidth + distanceLeft,
        0.3 * height - lineWidth,
      )
      ctx.lineTo(
        0.25 * width - 0.5 * lineWidth + distanceLeft,
        0.3 * height - lineWidth,
      )

      ctx.moveTo(
        0.25 * width - 0.5 * lineWidth + distanceLeft,
        0.7 * height + lineWidth,
      )
      ctx.lineTo(
        0.25 * width - 0.5 * lineWidth + distanceLeft,
        0.7 * height + lineWidth,
      )
      ctx.stroke()
      distanceLeft += 0.5 * width - 0.5 * lineWidth
    }
    else {
      ctx.beginPath()
      ctx.lineCap = 'square'
      ctx.globalAlpha = 1
      ctx.moveTo(
        0.25 * width - 0.5 * lineWidth + distanceLeft,
        height - lineWidth,
      )
      ctx.lineTo(
        0.25 * width - 0.5 * lineWidth + distanceLeft,
        height - lineWidth,
      )
      ctx.stroke()
      distanceLeft += 0.5 * width - 0.5 * lineWidth
    }
  }
}
/*
 *设置单个数字的值的方法
 *num：传入单个数字的值，也可能为 '-'
 *opacity：设置led不亮部分的透明度，此处默认为0.1，但是如果需要调整请在调用此方法的地方输入透明度
 */
function setNumber(num: number | string, opacity: number): number[] {
  let styleLed = []
  switch (num.toString()) {
    case '0':
      styleLed = [1, 1, 1, 1, 1, 1, opacity]
      break
    case '1':
      styleLed = [opacity, 1, 1, opacity, opacity, opacity, opacity]
      break
    case '2':
      styleLed = [1, 1, opacity, 1, 1, opacity, 1]
      break
    case '3':
      styleLed = [1, 1, 1, 1, opacity, opacity, 1]
      break
    case '4':
      styleLed = [opacity, 1, 1, opacity, opacity, 1, 1]
      break
    case '5':
      styleLed = [1, opacity, 1, 1, opacity, 1, 1]
      break
    case '6':
      styleLed = [1, opacity, 1, 1, 1, 1, 1]
      break
    case '7':
      styleLed = [1, 1, 1, opacity, opacity, opacity, opacity]
      break
    case '8':
      styleLed = [1, 1, 1, 1, 1, 1, 1]
      break
    case '9':
      styleLed = [1, 1, 1, 1, opacity, 1, 1]
      break
    case '-':
      styleLed = [
        opacity,
        opacity,
        opacity,
        opacity,
        opacity,
        opacity,
        1,
      ]
      break
    default:
      styleLed = [
        opacity,
        opacity,
        opacity,
        opacity,
        opacity,
        opacity,
        opacity,
      ]
      break
  }
  return styleLed
}
</script>

<template>
  <!-- 如果没有外层的div标签，则父组件中的v-show不起作用 -->
  <div><canvas id="canvas" /></div>
</template>

<style>
#canvas
{
  margin-right: var(--margin-right);
  padding: 0;
}
</style>

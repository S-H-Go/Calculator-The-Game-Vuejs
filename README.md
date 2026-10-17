# 前言

该程序模仿[计算器 - 游戏](https://www.taptap.com/app/56200)设计，试图使用网页技术实现该游戏，玩法及界面设计均来自原游戏。
可以在 play 商店中[下载](https://play.google.com/store/apps/details?id=com.sm.calculateme&hl=zh&gl=US)原游戏。


使用 [Vite](https://vitejs.dev/) + [Vue](https://vuejs.org/) + [Pinia](https://pinia.vuejs.org/) + [Typescript](https://www.typescriptlang.org/)。


关于该项目的一点[小故事](https://sweethg.club/2022-06-05/calculator-game/)。



部署地址：[www.sweethg.club/calculator-game](https://www.sweethg.club/calculator-game)



# 运行环境

> node.js

# 本地运行

1. 克隆该仓库

```shell
https://github.com/S-H-Go/calculator-game-web
```

2. 进入代码文件夹

```shell
cd calculator-game-web
```

3. 安装依赖

```shell
npm install
```

4. 开发环境运行

```shell
npm run dev
```

访问控制台输出的链接即可打开

# 按钮结构

所有游戏按钮、对话选项、空位和设置按钮统一由 `src/components/Button.vue` 渲染。

- `src/modules/interface.ts` 的 `IButtonInfo` 描述位置、文字、颜色、禁用状态和操作回调。
- `src/modules/operations.ts` 解析关卡按钮字符串，提供显示文字和颜色。
- `src/stores/level.ts` 管理运算、对话、Store 存取和切关操作，通过计算属性生成按钮列表。
- `src/components/ButtonPanel.vue` 按九宫格位置渲染列表，使用位置作为稳定的组件 key。

通用按钮只负责显示和输入事件，不包含游戏规则。普通操作使用 `operation`；需要按压的操作使用 `onPressStart`、`onPressEnd`、`onPressCancel`。鼠标和触摸统一使用 Pointer Events，移出、取消、窗口失焦或组件卸载时取消按压；键盘 Enter/空格保留原生按钮激活行为。

设置中的关卡加减按钮短按切换一级，长按 400ms 后连续切换并逐渐加速，最短间隔为 40ms。松手或取消时停止，再次按下时恢复初始速度。

# 验证

```shell
npm test
npm run build
```

测试使用 Node.js 内置测试工具、Vue 编译器和自定义渲染器，不新增测试依赖。覆盖通用按钮事件、Store 长短按、连续切关、Each、重置、通关和对话流程；实际页面布局及设备触摸体验需要另行在浏览器验收。运行测试建议使用 Node.js 20 或更高版本。

传送门仍未实现，本次按钮重构不包含该功能。

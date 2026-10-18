# 前言

该程序模仿[计算器 - 游戏](https://www.taptap.com/app/56200)设计，试图使用网页技术实现该游戏，玩法及界面设计均来自原游戏。
可以在 play 商店中[下载](https://play.google.com/store/apps/details?id=com.sm.calculateme&hl=zh&gl=US)原游戏。


使用 [Vite](https://vitejs.dev/) + [Vue](https://vuejs.org/) + [Pinia](https://pinia.vuejs.org/) + [Typescript](https://www.typescriptlang.org/)。


关于该项目的一点[小故事](https://sweethg.club/2022-06-05/calculator-game/)。



部署地址：[www.sweethg.club/calculator-game](https://www.sweethg.club/calculator-game)



## 运行环境

> Node.js 22.22.2+（22 LTS）、24.15.0+（24 LTS）或 26+，pnpm 10.33.0。具体版本范围见 `package.json` 的 `engines`，测试环境也需要满足该约束。

## 本地运行

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
pnpm install
```

4. 开发环境运行

```shell
pnpm dev
```

访问控制台输出的链接即可打开

## 按钮结构

所有游戏按钮、对话选项、空位和设置按钮统一由 `src/components/Button.vue` 渲染。

- `src/modules/interface.ts` 的 `IButtonInfo` 描述位置、文字、颜色、禁用状态和操作回调。
- `src/modules/operations.ts` 解析关卡按钮字符串，提供显示文字和颜色。
- `src/stores/level.ts` 管理运算、对话、Store 存取和切关操作，通过计算属性生成按钮列表。
- `src/components/ButtonPanel.vue` 按九宫格位置渲染列表，使用位置作为稳定的组件 key。

通用按钮只负责显示和输入事件，不包含游戏规则。普通操作使用 `operation`；需要按压的操作使用 `onPressStart`、`onPressEnd`、`onPressCancel`。鼠标和触摸统一使用 Pointer Events，移出、取消、窗口失焦或组件卸载时取消按压；键盘 Enter/空格保留原生按钮激活行为。

设置中的关卡加减按钮短按切换一级，长按 400ms 后连续切换并逐渐加速，最短间隔为 40ms。松手或取消时停止，再次按下时恢复初始速度。

## 验证

```shell
pnpm test
pnpm lint
pnpm build
```

测试使用 Vitest、Vue Test Utils 和 jsdom，组件通过 Vite 的 Vue 插件直接加载。覆盖通用按钮事件、Store 长短按、连续切关、Each、重置、通关、对话流程、传送门动画和数字闪烁；定时行为使用 Vitest 假时钟，无需实际等待动画。实际页面布局及设备触摸体验需要另行在浏览器验收。

```shell
pnpm test:watch
pnpm test:coverage
```

`test:watch` 在修改文件后自动重跑相关测试；`test:coverage` 输出覆盖率摘要，并生成 `coverage/index.html` 报告。覆盖范围包含运算模块、状态管理、通用按钮和数字屏幕组件。

测试按职责组织：`tests/components` 验证组件交互和渲染，`tests/modules` 验证纯运算规则，`tests/stores` 验证关卡流程、连续切关和传送门动画。`tests/setup.js` 统一隔离 Pinia、假时钟及浏览器存储，并在每个用例后卸载组件、恢复 mock；`tests/helpers` 提供组件输入和关卡初始化辅助函数。

## 传送门

关卡的 `portals.entrance` 和 `portals.exit` 从右向左按数位编号，个位为 0、十位为 1。入口必须在出口左侧。每次数字操作后，入口数字会移除并加到出口所在位；如果进位或剩余高位再次到达入口，会继续传送，整个过程不额外消耗步数。负数按绝对值传送并保留符号。

例如 `{ "entrance": 2, "exit": 0 }` 会将 `991` 连续变为 `100`、`1`。传送结束后才判断目标和显示范围。屏幕通过数字上方的出口三角和下方的入口三角标示传送位置；CLR 恢复关卡原始数字。

入口有数字时，下方三角先闪烁，再执行一次传送，然后上方三角闪烁；连续传送会依次重复此流程。每段闪烁与 CLR 共用时长（当前为 900ms）。动画期间运算按钮暂停响应，CLR 和设置仍可使用；重置或切关会取消尚未完成的传送。

## 依赖升级说明

2026-10-17 更新了 Vue、Pinia、Vite、ESLint 及相关工具的稳定版本。TypeScript 直接依赖 `~6.0.3`，允许安装 6.0 系列的后续补丁版本；TypeScript 7.0 暂不提供当前 `vue-tsc` 和 TypeScript ESLint 所依赖的旧编译器 API，直接安装会导致类型检查失败。待生态支持后再迁移到原生编译器。参见[官方迁移说明](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-60)。

Pinia 4 要求显式安装 `@vue/devtools-api`。TypeScript 模块解析使用 `bundler`，移除了已弃用的 `baseUrl`。安装依赖时会通过 `prepare` 配置 Git 提交钩子；钩子直接运行项目内的 lint-staged，不依赖全局 pnpm 命令。

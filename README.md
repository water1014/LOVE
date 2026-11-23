# 小窝

他和她的小窝 · 情侣主页（PWA）

纯静态、零构建、零依赖框架。所有数据存本地（localStorage），
改样式只动 `css/tokens.css`（设计规范见 `docs/design-tokens.md`）。

## 目录

```
index.html      入口（含意象 SVG sprite + 防闪烁主题脚本）
manifest.json   PWA 配置
icon.svg        图标
css/            tokens（宪法）→ base → home → pages → dock
js/             store → widgets → pages → main（全局命名空间 XW）
docs/           design-tokens.md 设计规范说明书
```

## 本地预览

直接双击 `index.html`，或 `python3 -m http.server` 后访问。

## 部署 GitHub Pages

1. 把本目录内容推到仓库（如 `phone/` 子目录或根目录）。
2. Settings → Pages → Source 选 `Deploy from a branch`。
3. 选对应分支和目录，保存后约一分钟上线。

> 若放在子目录，访问路径即 `https://<用户名>.github.io/<仓库>/phone/`。

## 常用修改

- 换强调色：`css/tokens.css` 的 `--accent`
- 名字 / 纪念日 / 城市 / 额度 / 歌：页面里「更多」
- 新增装饰意象：先画进 `index.html` 顶部 sprite，
  到 `docs/design-tokens.md` 第八、九章登记后再用

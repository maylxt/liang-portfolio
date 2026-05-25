# 首屏视频规范 · Hero Video Spec

> 用于个人网站首屏全屏循环背景视频。视频会被设置为 `autoPlay / loop / muted / playsInline`，并以 `object-fit: cover` 全屏铺满；上层会盖一层暗化 vignette + 居中文案。

## 推荐技术参数

| 项目 | 推荐值 | 说明 |
|---|---|---|
| **格式** | MP4（H.264/AVC）+ WebM（VP9）双轨 | MP4 兼容性最好；WebM 体积更小，可作为 `<source>` 备选 |
| **分辨率** | 1920 × 1080（横屏 16:9） | 桌面端主流；移动端会自动 cover 裁切 |
| **帧率** | 24 / 25 / 30 fps | 不需要 60 fps，浪费体积 |
| **时长** | **6–12 秒** | 必须能 **无缝循环**（首尾帧一致） |
| **码率** | 3–6 Mbps | 静谧画面 3 Mbps 足够，运动多取 6 Mbps |
| **文件大小** | **≤ 6 MB**（理想 ≤ 3 MB） | 首屏加载体验关键 |
| **音频** | **无音轨** | 浏览器静音播放，去掉减体积 |
| **色彩** | sRGB / BT.709，8-bit | 不要 HDR / 10-bit |

## 视觉建议

- **画面构图**：中心 30% × 30% 的区域应保持留白或低对比，不要有强烈主体——这块区域会被中央文案覆盖
- **明暗倾向**：整体偏暗（中位亮度 30–50%）；过亮会让白色文案读不清。保留一份原始素材，我可以用 CSS `filter` 进一步压暗
- **运动幅度**：缓慢、连续、低对比的运动最理想（雾、水、粒子、慢推镜头）。剧烈快切会和文案打架
- **首尾帧**：制作时务必让 **第一帧 = 最后一帧**，否则循环时会有跳跃。可以在剪辑工具里头尾叠加 0.5s 交叉淡化
- **安全色域**：避免画面里出现荧光色 / 高饱和品牌色，否则会和强调色 `#ff5a2e` 冲突

## 内容素材方向（建议你提供其中一种）

1. **AI 抽象动效** — 粒子流体 / 数据可视化 / 神经网络生长（最贴合「AI 效果设计师」身份）
2. **个人创作过程** — 你建模 / 渲染 / 即梦操作的屏幕录制延时
3. **作品集集锦** — 5–8 个 AI 人像 / 特效成品的慢速 Ken Burns 拼接
4. **环境氛围** — 工作室、屏幕反光、纸面草图微距等情绪片段

## 命名 & 提交

```
assets/hero-bg.mp4       ← 主源（H.264）
assets/hero-bg.webm      ← 可选备源（VP9，体积更小）
assets/hero-bg-poster.jpg ← 海报图（视频未加载时显示，1920×1080，≤200 KB）
```

提交后我把 `app.jsx` 里的 `HERO_VIDEO` 常量替换为本地路径即可：

```js
const HERO_VIDEO  = "assets/hero-bg.mp4";
const HERO_POSTER = "assets/hero-bg-poster.jpg";
```

## 压缩工具

- **HandBrake**（免费 GUI）：Web Optimized ✅，preset 选 `Web - Vimeo YouTube HQ 1080p30`
- **FFmpeg**：
  ```bash
  ffmpeg -i input.mov -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p \
         -movflags +faststart -an -vf "scale=1920:1080" hero-bg.mp4
  ```
  关键参数：`-an`（去音轨）、`-movflags +faststart`（首字节即可播放）、`-pix_fmt yuv420p`（Safari 兼容）

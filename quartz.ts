import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"

const config = await loadQuartzConfig()

// Enable custom OG image generation only during Cloudflare Pages builds
const isCloudflareBuild = process.env.CF_PAGES === "1"

if (!isCloudflareBuild) {
  config.plugins.emitters = config.plugins.emitters.filter(
    (emitter) => emitter.name !== "CustomOgImages",
  )
}

export default config
export const layout = await loadQuartzLayout()

import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"

const config = await loadQuartzConfig()

// Enable custom OG image generation during Cloudflare Pages / CI builds
const isCloudflareBuild =
  process.env.CF_PAGES === "1" || process.env.CI === "true" || process.env.CI === "1"

if (!isCloudflareBuild) {
  config.plugins.emitters = config.plugins.emitters.filter(
    (emitter) => emitter.name !== "CustomOgImages",
  )
}

export default config
export const layout = await loadQuartzLayout()

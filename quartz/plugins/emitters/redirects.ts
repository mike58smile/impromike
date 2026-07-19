import { Element, Root } from "hast"
import { visit } from "unist-util-visit"
import { VFile } from "vfile"
import { BuildCtx } from "../../util/ctx"
import { FullSlug } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import { write } from "./helpers"

// content/r/<name>.md -> <site>/r/<name> redirects to the URL linked in the note body
const REDIRECT_ROOT = "r/"

function findRedirectTarget(tree: Root): string | undefined {
  let target: string | undefined
  visit(tree, "element", (node: Element) => {
    if (target) return
    if (node.tagName === "a" && typeof node.properties?.href === "string") {
      target = node.properties.href
    }
  })
  return target
}

function redirectPage(slug: FullSlug, target: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en-us">
    <head>
    <title>${slug}</title>
    <link rel="canonical" href="${target}">
    <meta name="robots" content="noindex">
    <meta charset="utf-8">
    <meta http-equiv="refresh" content="0; url=${target}">
    </head>
    </html>
    `
}

async function* processFile(ctx: BuildCtx, tree: Root, file: VFile) {
  const slug = file.data.slug!
  if (!slug.startsWith(REDIRECT_ROOT) || slug.endsWith("/index")) return

  const target = findRedirectTarget(tree)
  if (!target) {
    console.log(`[RedirectPages] no link found in ${file.data.relativePath}, skipping`)
    return
  }

  yield write({
    ctx,
    content: redirectPage(slug, target),
    slug,
    ext: ".html",
  })
}

export const RedirectPages: QuartzEmitterPlugin = () => ({
  name: "RedirectPages",
  async *emit(ctx, content) {
    for (const [tree, file] of content) {
      yield* processFile(ctx, tree, file)
    }
  },
  async *partialEmit(ctx, content, _resources, changeEvents) {
    const changedSlugs = new Set<string>()
    for (const changeEvent of changeEvents) {
      if (!changeEvent.file) continue
      if (changeEvent.type === "add" || changeEvent.type === "change") {
        changedSlugs.add(changeEvent.file.data.slug!)
      }
    }

    for (const [tree, file] of content) {
      const slug = file.data.slug!
      if (!changedSlugs.has(slug)) continue
      yield* processFile(ctx, tree, file)
    }
  },
})

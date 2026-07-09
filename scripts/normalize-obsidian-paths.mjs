import { promises as fs } from 'node:fs'
import path from 'node:path'

const ROOT_DIR = process.cwd()
const CONTENT_DIR = path.join(ROOT_DIR, 'content')
const MARKDOWN_EXTENSIONS = new Set(['.md', '.mdx'])

function shouldKeepUrl(url) {
  return (
    url.startsWith('./') ||
    url.startsWith('../') ||
    url.startsWith('/') ||
    url.startsWith('#') ||
    url.startsWith('?') ||
    /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url)
  )
}

function normalizeUrl(url) {
  const trimmed = url.trim()
  if (!trimmed || shouldKeepUrl(trimmed)) return url
  return url.replace(trimmed, `./${trimmed}`)
}

function normalizeMarkdownLinks(input) {
  return input.replace(/(!?\[[^\]]*]\()([^)]+)(\))/g, (_, prefix, url, suffix) => {
    return `${prefix}${normalizeUrl(url)}${suffix}`
  })
}

function normalizeQuotedSrcHref(input) {
  return input.replace(
    /\b(src|href)\s*=\s*(["'])([^"']+)\2/g,
    (_, attr, quote, value) => `${attr}=${quote}${normalizeUrl(value)}${quote}`
  )
}

async function walkMarkdownFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await walkMarkdownFiles(fullPath)))
      continue
    }
    if (entry.isFile() && MARKDOWN_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath)
    }
  }

  return files
}

async function main() {
  try {
    await fs.access(CONTENT_DIR)
  } catch {
    console.log('[normalize-obsidian-paths] skip: content directory not found')
    return
  }

  const files = await walkMarkdownFiles(CONTENT_DIR)
  let changedCount = 0

  for (const filePath of files) {
    const original = await fs.readFile(filePath, 'utf8')
    const normalized = normalizeQuotedSrcHref(normalizeMarkdownLinks(original))
    if (normalized === original) continue

    await fs.writeFile(filePath, normalized, 'utf8')
    changedCount += 1
  }

  console.log(`[normalize-obsidian-paths] scanned ${files.length} files, changed ${changedCount}`)
}

main().catch((error) => {
  console.error('[normalize-obsidian-paths] failed:', error)
  process.exitCode = 1
})

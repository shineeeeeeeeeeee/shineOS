/**
 * One-off generator for src/data/leetcodeArchive.ts.
 *
 * Reads the GitHub tree of shineeeeeeeeeeee/LeetcodeDSA (fetched to
 * /tmp/lcdsa-tree.json) and emits the manifest array as TypeScript, so the 131
 * folder names in the data file are transcribed by machine rather than by hand.
 *
 * This script is build-time scaffolding for the audit, not part of the app.
 */
import fs from 'node:fs'

const tree = JSON.parse(fs.readFileSync('/tmp/lcdsa-tree.json', 'utf8')).tree

const folders = tree.filter((e) => e.type === 'tree' && !e.path.includes('/')).map((e) => e.path)

const rows = folders
  .map((folder) => {
    const direct = tree.filter(
      (e) => e.type === 'blob' && e.path.startsWith(`${folder}/`) && e.path.split('/').length === 2
    )
    const files = direct.map((f) => f.path.split('/')[1]).sort()
    const number = parseInt(folder.split('-')[0], 10)
    return { folder, number, files }
  })
  .sort((a, b) => a.number - b.number || a.folder.localeCompare(b.folder))

const body = rows
  .map(
    (r) =>
      `  { folder: '${r.folder}', number: ${r.number}, files: [${r.files
        .map((f) => `'${f}'`)
        .join(', ')}] },`
  )
  .join('\n')

fs.writeFileSync('/tmp/gen/manifest.part.ts', body)

console.log('folders:', rows.length)
console.log('files in folders:', rows.reduce((n, r) => n + r.files.length, 0))
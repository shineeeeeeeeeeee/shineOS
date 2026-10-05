/**
 * Runtime check of the derived LeetcodeDSA selectors.
 *
 * The point is that nothing on the artifact is a typed-in number. This prints
 * what the selectors actually compute so those figures can be compared against
 * the repository itself.
 */
import {
  documentationOnlyFolders,
  dsaArchive,
  foldersWithExtraNotes,
  javaFileCount,
  javaFolderCount,
  languageBreakdown,
  markdownFileCount,
  notesFileCount,
  problemNumberRange,
  pythonFileCount,
  pythonFolderCount,
  repositoryFileCount,
  sampleDsaFolders,
  solutionFolderCount,
  solutionLanguages,
} from '../src/data/leetcodeArchive'

console.log('solution folders   :', solutionFolderCount)
console.log('repository files   :', repositoryFileCount)
console.log('problem range      :', problemNumberRange.min, '-', problemNumberRange.max)
console.log('language breakdown :', JSON.stringify(languageBreakdown))
console.log('solution languages :', JSON.stringify(solutionLanguages))
console.log('.java files        :', javaFileCount, 'in', javaFolderCount, 'folders')
console.log('.py files          :', pythonFileCount, 'in', pythonFolderCount, 'folders')
console.log('.md files          :', markdownFileCount, '(of which', notesFileCount, 'inside folders)')
console.log('extra Notes.md     :', foldersWithExtraNotes, 'folders')
console.log('write-up only      :', documentationOnlyFolders.map((e) => e.folder))
console.log('first folder       :', dsaArchive[0].folder)
console.log('last folder        :', dsaArchive[dsaArchive.length - 1].folder)
console.log('sample (stride 17) :', sampleDsaFolders(4).map((e) => e.folder))

// Invariants the artifact relies on. Any of these failing means a figure on
// screen would be inconsistent with another.
const checks = [
  ['folder count is 131', solutionFolderCount === 131],
  ['every folder has a number', dsaArchive.every((e) => Number.isInteger(e.number))],
  ['java+py file counts equal folder files', javaFileCount + pythonFileCount === 292 - markdownFileCount + 1],
  ['sum of breakdown equals repository files', languageBreakdown.reduce((n, e) => n + e.count, 0) === repositoryFileCount],
  ['min is 1', problemNumberRange.min === 1],
  ['max is 4285', problemNumberRange.max === 4285],
  ['write-up-only folders have no code', documentationOnlyFolders.every((e) => e.files.every((f) => f.endsWith('.md')))],
]

let failed = 0
for (const [label, ok] of checks) {
  console.log(ok ? `  PASS  ${label}` : `  FAIL  ${label}`)
  if (!ok) failed += 1
}
console.log(failed === 0 ? '\nALL CHECKS PASSED' : `\n${failed} CHECK(S) FAILED`)
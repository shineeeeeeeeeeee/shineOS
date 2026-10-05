/**
 * LeetcodeDSA — the archive, transcribed from the repository.
 *
 * Every entry of `dsaArchive` below is a real top-level directory of
 * github.com/shineeeeeeeeeeee/LeetcodeDSA on the `main` branch: the folder name as
 * Git stores it, the LeetCode problem number parsed out of that name, and the
 * exact files that folder contains.
 *
 * Nothing in the UI is typed by hand. The solution count, the language and file
 * breakdown, the problem-number range and the index lines printed on the artifact
 * are all derived by the selectors at the bottom of this file, so the numbers on
 * screen cannot drift away from the repository they describe.
 *
 * WHY A COMPILED MANIFEST AND NOT A RUNTIME FETCH
 * The archive is static source material. A GitHub request at runtime would put a
 * network dependency and a rate limit in front of a portfolio page, and would let
 * the figures change without the code changing — which is exactly the kind of
 * quiet fabrication this project avoids. Compiling the manifest keeps the artifact
 * fast, reproducible and offline.
 *
 * HOW IT WAS CAPTURED
 * `GET /repos/shineeeeeeeeeeee/LeetcodeDSA/git/trees/main?recursive=1`, filtered to
 * `type === 'tree'`. 131 directories, 293 files, nothing nested deeper than one
 * folder level. A correction worth recording: an earlier audit of this repository
 * reported "132 solution folders". 132 is the count of top-level *entries* — 131
 * folders plus the root README.md. The selectors below therefore print 131, and
 * the root README is counted as a file rather than as a folder.
 */

// ============================================
// Types
// ============================================

/** One solution folder, exactly as the repository stores it. */
export interface DsaArchiveEntry {
  /** Folder name as Git reports it, e.g. `1-two-sum`. */
  folder: string
  /** LeetCode problem number, parsed from the numeric folder-name prefix. */
  number: number
  /** Files inside the folder, by their exact repository filenames. */
  files: string[]
}

/** Repository root path, used for the printed archive label. */
export const dsaRepositoryPath = 'shineeeeeeeeeeee/LeetcodeDSA'

/**
 * The root README is a real repository file and is counted with the files, but it
 * lives outside every solution folder, so it is recorded separately rather than
 * being folded into a folder count.
 */
const rootFiles: string[] = ['README.md']

// ============================================
// Manifest
// ============================================

/**
 * All 131 solution folders, in ascending problem-number order.
 *
 * Sorted by number because that is how the archive reads top to bottom; the
 * repository itself stores them in lexicographic folder order, which puts
 * problem 4285 above problem 20.
 */
export const dsaArchive: DsaArchiveEntry[] = [
  { folder: '1-two-sum', number: 1, files: ['README.md', 'two-sum.java'] },
  { folder: '2-add-two-numbers', number: 2, files: ['README.md', 'add-two-numbers.java'] },
  { folder: '3-longest-substring-without-repeating-characters', number: 3, files: ['README.md', 'longest-substring-without-repeating-characters.java'] },
  { folder: '15-3sum', number: 15, files: ['3sum.java', 'README.md'] },
  { folder: '20-valid-parentheses', number: 20, files: ['Notes.md', 'README.md', 'valid-parentheses.java'] },
  { folder: '22-generate-parentheses', number: 22, files: ['README.md', 'generate-parentheses.java'] },
  { folder: '32-longest-valid-parentheses', number: 32, files: ['README.md', 'longest-valid-parentheses.java'] },
  { folder: '53-maximum-subarray', number: 53, files: ['README.md', 'maximum-subarray.java'] },
  { folder: '54-spiral-matrix', number: 54, files: ['README.md', 'spiral-matrix.java'] },
  { folder: '70-climbing-stairs', number: 70, files: ['README.md', 'climbing-stairs.java'] },
  { folder: '73-set-matrix-zeroes', number: 73, files: ['README.md', 'set-matrix-zeroes.java'] },
  { folder: '115-distinct-subsequences', number: 115, files: ['README.md', 'distinct-subsequences.java'] },
  { folder: '121-best-time-to-buy-and-sell-stock', number: 121, files: ['README.md', 'best-time-to-buy-and-sell-stock.java'] },
  { folder: '136-single-number', number: 136, files: ['README.md', 'single-number.java'] },
  { folder: '200-number-of-islands', number: 200, files: ['README.md', 'number-of-islands.java'] },
  { folder: '209-minimum-size-subarray-sum', number: 209, files: ['README.md', 'minimum-size-subarray-sum.java'] },
  { folder: '217-contains-duplicate', number: 217, files: ['README.md', 'contains-duplicate.java'] },
  { folder: '219-contains-duplicate-ii', number: 219, files: ['README.md', 'contains-duplicate-ii.java'] },
  { folder: '268-missing-number', number: 268, files: ['README.md', 'missing-number.java'] },
  { folder: '322-coin-change', number: 322, files: ['README.md', 'coin-change.java'] },
  { folder: '448-find-all-numbers-disappeared-in-an-array', number: 448, files: ['README.md', 'find-all-numbers-disappeared-in-an-array.java'] },
  { folder: '486-predict-the-winner', number: 486, files: ['README.md', 'predict-the-winner.java'] },
  { folder: '628-maximum-product-of-three-numbers', number: 628, files: ['README.md', 'maximum-product-of-three-numbers.java'] },
  { folder: '678-valid-parenthesis-string', number: 678, files: ['README.md', 'valid-parenthesis-string.java'] },
  { folder: '864-image-overlap', number: 864, files: ['Notes.md', 'README.md', 'image-overlap.java'] },
  { folder: '866-rectangle-overlap', number: 866, files: ['Notes.md', 'README.md', 'rectangle-overlap.java'] },
  { folder: '875-longest-mountain-in-array', number: 875, files: ['README.md', 'longest-mountain-in-array.java'] },
  { folder: '909-stone-game', number: 909, files: ['README.md', 'stone-game.java'] },
  { folder: '977-distinct-subsequences-ii', number: 977, files: ['Notes.md', 'README.md', 'distinct-subsequences-ii.java'] },
  { folder: '1019-squares-of-a-sorted-array', number: 1019, files: ['README.md', 'squares-of-a-sorted-array.java'] },
  { folder: '1159-smallest-subsequence-of-distinct-characters', number: 1159, files: ['Notes.md', 'README.md', 'smallest-subsequence-of-distinct-characters.java'] },
  { folder: '1188-brace-expansion-ii', number: 1188, files: ['README.md', 'brace-expansion-ii.java'] },
  { folder: '1208-maximum-nesting-depth-of-two-valid-parentheses-strings', number: 1208, files: ['README.md', 'maximum-nesting-depth-of-two-valid-parentheses-strings.java'] },
  { folder: '1212-sequential-digits', number: 1212, files: ['Notes.md', 'README.md', 'sequential-digits.java'] },
  { folder: '1222-remove-covered-intervals', number: 1222, files: ['README.md', 'remove-covered-intervals.java'] },
  { folder: '1234-number-of-paths-with-max-score', number: 1234, files: ['README.md'] },
  { folder: '1240-stone-game-ii', number: 1240, files: ['README.md', 'stone-game-ii.java'] },
  { folder: '1256-rank-transform-of-an-array', number: 1256, files: ['Notes.md', 'README.md', 'rank-transform-of-an-array.java'] },
  { folder: '1297-maximum-number-of-balloons', number: 1297, files: ['README.md', 'maximum-number-of-balloons.java'] },
  { folder: '1298-reverse-substrings-between-each-pair-of-parentheses', number: 1298, files: ['README.md', 'reverse-substrings-between-each-pair-of-parentheses.java'] },
  { folder: '1306-minimum-absolute-difference', number: 1306, files: ['README.md', 'minimum-absolute-difference.java'] },
  { folder: '1386-shift-2d-grid', number: 1386, files: ['README.md', 'shift-2d-grid.java'] },
  { folder: '1395-minimum-time-visiting-all-points', number: 1395, files: ['README.md', 'minimum-time-visiting-all-points.java'] },
  { folder: '1446-angle-between-hands-of-a-clock', number: 1446, files: ['README.md', 'angle-between-hands-of-a-clock.java'] },
  { folder: '1460-number-of-substrings-containing-all-three-characters', number: 1460, files: ['README.md', 'number-of-substrings-containing-all-three-characters.java'] },
  { folder: '1482-how-many-numbers-are-smaller-than-the-current-number', number: 1482, files: ['README.md', 'how-many-numbers-are-smaller-than-the-current-number.java'] },
  { folder: '1487-cinema-seat-allocation', number: 1487, files: ['README.md', 'cinema-seat-allocation.java'] },
  { folder: '1501-circle-and-rectangle-overlapping', number: 1501, files: ['Notes.md', 'README.md', 'circle-and-rectangle-overlapping.java'] },
  { folder: '1522-stone-game-iii', number: 1522, files: ['README.md', 'stone-game-iii.java'] },
  { folder: '1573-find-two-non-overlapping-sub-arrays-each-with-target-sum', number: 1573, files: ['Notes.md', 'README.md', 'find-two-non-overlapping-sub-arrays-each-with-target-sum.java'] },
  { folder: '1574-maximum-product-of-two-elements-in-an-array', number: 1574, files: ['Notes.md', 'README.md', 'maximum-product-of-two-elements-in-an-array.java'] },
  { folder: '1617-stone-game-iv', number: 1617, files: ['Notes.md', 'README.md', 'stone-game-iv.java'] },
  { folder: '1644-maximum-number-of-non-overlapping-substrings', number: 1644, files: ['Notes.md', 'README.md', 'maximum-number-of-non-overlapping-substrings.java'] },
  { folder: '1685-stone-game-v', number: 1685, files: ['Notes.md', 'README.md', 'stone-game-v.java'] },
  { folder: '1725-number-of-sets-of-k-non-overlapping-line-segments', number: 1725, files: ['Notes.md', 'README.md', 'number-of-sets-of-k-non-overlapping-line-segments.java'] },
  { folder: '1737-maximum-nesting-depth-of-the-parentheses', number: 1737, files: ['README.md', 'maximum-nesting-depth-of-the-parentheses.java'] },
  { folder: '1776-minimum-operations-to-reduce-x-to-zero', number: 1776, files: ['README.md', 'minimum-operations-to-reduce-x-to-zero.java'] },
  { folder: '1833-find-the-highest-altitude', number: 1833, files: ['README.md', 'find-the-highest-altitude.java'] },
  { folder: '1934-evaluate-the-bracket-pairs-of-a-string', number: 1934, files: ['README.md', 'evaluate-the-bracket-pairs-of-a-string.java'] },
  { folder: '1956-maximum-element-after-decreasing-and-rearranging', number: 1956, files: ['README.md', 'maximum-element-after-decreasing-and-rearranging.java'] },
  { folder: '1961-maximum-ice-cream-bars', number: 1961, files: ['README.md', 'maximum-ice-cream-bars.java'] },
  { folder: '1968-maximum-building-height', number: 1968, files: ['README.md', 'maximum-building-height.java'] },
  { folder: '2002-stone-game-viii', number: 2002, files: ['README.md', 'stone-game-viii.java'] },
  { folder: '2039-sum-game', number: 2039, files: ['README.md', 'sum-game.java'] },
  { folder: '2106-find-greatest-common-divisor-of-array', number: 2106, files: ['README.md', 'find-greatest-common-divisor-of-array.java'] },
  { folder: '2156-stone-game-ix', number: 2156, files: ['Notes.md', 'README.md', 'stone-game-ix.java'] },
  { folder: '2182-find-the-minimum-and-maximum-number-of-nodes-between-critical-points', number: 2182, files: ['README.md', 'find-the-minimum-and-maximum-number-of-nodes-between-critical-points.java'] },
  { folder: '2212-removing-minimum-and-maximum-from-array', number: 2212, files: ['README.md', 'removing-minimum-and-maximum-from-array.java'] },
  { folder: '2319-longest-substring-of-one-repeating-character', number: 2319, files: ['README.md', 'longest-substring-of-one-repeating-character.java'] },
  { folder: '2347-count-nodes-equal-to-average-of-subtree', number: 2347, files: ['Notes.md', 'README.md', 'count-nodes-equal-to-average-of-subtree.java'] },
  { folder: '2349-check-if-there-is-a-valid-parentheses-string-path', number: 2349, files: ['README.md', 'check-if-there-is-a-valid-parentheses-string-path.java'] },
  { folder: '2559-maximum-number-of-non-overlapping-palindrome-substrings', number: 2559, files: ['Notes.md', 'README.md', 'maximum-number-of-non-overlapping-palindrome-substrings.java'] },
  { folder: '2582-minimum-score-of-a-path-between-two-cities', number: 2582, files: ['README.md', 'minimum-score-of-a-path-between-two-cities.java'] },
  { folder: '2793-count-the-number-of-complete-components', number: 2793, files: ['README.md', 'count-the-number-of-complete-components.java'] },
  { folder: '2914-find-the-safest-path-in-a-grid', number: 2914, files: ['README.md', 'find-the-safest-path-in-a-grid.java'] },
  { folder: '3150-shortest-and-lexicographically-smallest-beautiful-string', number: 3150, files: ['Notes.md', 'README.md', 'shortest-and-lexicographically-smallest-beautiful-string.java'] },
  { folder: '3219-make-lexicographically-smallest-array-by-swapping-elements', number: 3219, files: ['README.md', 'make-lexicographically-smallest-array-by-swapping-elements.java'] },
  { folder: '3225-length-of-longest-subarray-with-at-most-k-frequency', number: 3225, files: ['README.md', 'length-of-longest-subarray-with-at-most-k-frequency.java'] },
  { folder: '3236-smallest-missing-integer-greater-than-sequential-prefix-sum', number: 3236, files: ['README.md', 'smallest-missing-integer-greater-than-sequential-prefix-sum.java'] },
  { folder: '3275-minimum-number-of-pushes-to-type-word-i', number: 3275, files: ['README.md', 'minimum-number-of-pushes-to-type-word-i.java'] },
  { folder: '3276-minimum-number-of-pushes-to-type-word-ii', number: 3276, files: ['README.md', 'minimum-number-of-pushes-to-type-word-ii.java'] },
  { folder: '3299-find-the-maximum-number-of-elements-in-subset', number: 3299, files: ['README.md'] },
  { folder: '3347-distribute-elements-into-two-arrays-i', number: 3347, files: ['README.md', 'distribute-elements-into-two-arrays-i.java'] },
  { folder: '3349-maximum-length-substring-with-two-occurrences', number: 3349, files: ['README.md', 'maximum-length-substring-with-two-occurrences.java'] },
  { folder: '3375-kth-smallest-amount-with-single-denomination-combination', number: 3375, files: ['Notes.md', 'README.md', 'kth-smallest-amount-with-single-denomination-combination.java'] },
  { folder: '3558-find-a-safe-walk-through-a-grid', number: 3558, files: ['README.md', 'find-a-safe-walk-through-a-grid.java'] },
  { folder: '3561-remove-methods-from-project', number: 3561, files: ['README.md', 'remove-methods-from-project.java'] },
  { folder: '3562-maximum-score-of-non-overlapping-intervals', number: 3562, files: ['README.md', 'maximum-score-of-non-overlapping-intervals.java'] },
  { folder: '3583-sorted-gcd-pair-queries', number: 3583, files: ['Notes.md', 'README.md', 'sorted-gcd-pair-queries.java'] },
  { folder: '3584-find-the-lexicographically-smallest-valid-sequence', number: 3584, files: ['Notes.md', 'README.md', 'find-the-lexicographically-smallest-valid-sequence.java'] },
  { folder: '3608-find-the-number-of-subsequences-with-equal-gcd', number: 3608, files: ['Notes.md', 'README.md', 'find-the-number-of-subsequences-with-equal-gcd.java'] },
  { folder: '3626-smallest-divisible-digit-product-i', number: 3626, files: ['README.md', 'smallest-divisible-digit-product-i.java'] },
  { folder: '3635-smallest-divisible-digit-product-ii', number: 3635, files: ['README.md', 'smallest-divisible-digit-product-ii.java', 'smallest-divisible-digit-product-ii.py'] },
  { folder: '3705-find-the-largest-almost-missing-integer', number: 3705, files: ['README.md', 'find-the-largest-almost-missing-integer.java'] },
  { folder: '3799-unique-3-digit-even-numbers', number: 3799, files: ['README.md', 'unique-3-digit-even-numbers.java'] },
  { folder: '3804-maximize-active-section-with-trade-ii', number: 3804, files: ['README.md', 'maximize-active-section-with-trade-ii.java'] },
  { folder: '3805-maximize-active-section-with-trade-i', number: 3805, files: ['README.md', 'maximize-active-section-with-trade-i.java'] },
  { folder: '3811-reverse-degree-of-a-string', number: 3811, files: ['README.md', 'reverse-degree-of-a-string.java'] },
  { folder: '3812-smallest-palindromic-rearrangement-i', number: 3812, files: ['README.md', 'smallest-palindromic-rearrangement-i.java'] },
  { folder: '3813-smallest-palindromic-rearrangement-ii', number: 3813, files: ['README.md', 'smallest-palindromic-rearrangement-ii.java', 'smallest-palindromic-rearrangement-ii.py'] },
  { folder: '3820-number-of-unique-xor-triplets-ii', number: 3820, files: ['README.md', 'number-of-unique-xor-triplets-ii.java'] },
  { folder: '3824-number-of-unique-xor-triplets-i', number: 3824, files: ['README.md', 'number-of-unique-xor-triplets-i.java'] },
  { folder: '3831-find-x-value-of-array-i', number: 3831, files: ['README.md', 'find-x-value-of-array-i.java'] },
  { folder: '3838-path-existence-queries-in-a-graph-i', number: 3838, files: ['README.md', 'path-existence-queries-in-a-graph-i.java'] },
  { folder: '3840-find-x-value-of-array-ii', number: 3840, files: ['README.md', 'find-x-value-of-array-ii.java'] },
  { folder: '3852-path-existence-queries-in-a-graph-ii', number: 3852, files: ['README.md', 'path-existence-queries-in-a-graph-ii.java'] },
  { folder: '3859-maximum-product-of-two-digits', number: 3859, files: ['Notes.md', 'README.md', 'maximum-product-of-two-digits.java'] },
  { folder: '3869-smallest-index-with-digit-sum-equal-to-index', number: 3869, files: ['README.md', 'smallest-index-with-digit-sum-equal-to-index.java'] },
  { folder: '3870-minimum-moves-to-clean-the-classroom', number: 3870, files: ['README.md', 'minimum-moves-to-clean-the-classroom.java'] },
  { folder: '3918-check-divisibility-by-digit-sum-and-product', number: 3918, files: ['README.md', 'check-divisibility-by-digit-sum-and-product.java'] },
  { folder: '3919-network-recovery-pathways', number: 3919, files: ['README.md', 'network-recovery-pathways.java'] },
  { folder: '3939-process-string-with-special-operations-ii', number: 3939, files: ['README.md', 'process-string-with-special-operations-ii.java'] },
  { folder: '3962-number-of-zigzag-arrays-i', number: 3962, files: ['README.md', 'number-of-zigzag-arrays-i.java'] },
  { folder: '3964-number-of-zigzag-arrays-ii', number: 3964, files: ['README.md', 'number-of-zigzag-arrays-ii.java'] },
  { folder: '3995-gcd-of-odd-and-even-sums', number: 3995, files: ['Notes.md', 'README.md', 'gcd-of-odd-and-even-sums.java'] },
  { folder: '4020-lexicographically-smallest-permutation-greater-than-target', number: 4020, files: ['README.md', 'lexicographically-smallest-permutation-greater-than-target.java'] },
  { folder: '4033-longest-subsequence-with-non-zero-bitwise-xor', number: 4033, files: ['Notes.md', 'README.md', 'longest-subsequence-with-non-zero-bitwise-xor.java'] },
  { folder: '4037-lexicographically-smallest-palindromic-permutation-greater-than-target', number: 4037, files: ['README.md', 'lexicographically-smallest-palindromic-permutation-greater-than-target.java'] },
  { folder: '4074-count-subarrays-with-majority-element-i', number: 4074, files: ['README.md', 'count-subarrays-with-majority-element-i.java'] },
  { folder: '4075-count-subarrays-with-majority-element-ii', number: 4075, files: ['README.md', 'count-subarrays-with-majority-element-ii.java'] },
  { folder: '4080-smallest-missing-multiple-of-k', number: 4080, files: ['Notes.md', 'README.md', 'smallest-missing-multiple-of-k.java'] },
  { folder: '4107-find-missing-elements', number: 4107, files: ['README.md', 'find-missing-elements.java'] },
  { folder: '4135-concatenate-non-zero-digits-and-multiply-by-sum-i', number: 4135, files: ['README.md', 'concatenate-non-zero-digits-and-multiply-by-sum-i.java'] },
  { folder: '4136-concatenate-non-zero-digits-and-multiply-by-sum-ii', number: 4136, files: ['README.md', 'concatenate-non-zero-digits-and-multiply-by-sum-ii.java'] },
  { folder: '4242-sum-of-gcd-of-formed-pairs', number: 4242, files: ['Notes.md', 'README.md', 'sum-of-gcd-of-formed-pairs.java'] },
  { folder: '4245-count-commas-in-range', number: 4245, files: ['README.md', 'count-commas-in-range.java'] },
  { folder: '4248-count-commas-in-range-ii', number: 4248, files: ['README.md', 'count-commas-in-range-ii.java'] },
  { folder: '4256-construct-uniform-parity-array-i', number: 4256, files: ['README.md', 'construct-uniform-parity-array-i.java'] },
  { folder: '4258-construct-uniform-parity-array-ii', number: 4258, files: ['Notes.md', 'README.md', 'construct-uniform-parity-array-ii.java'] },
  { folder: '4284-smallest-stable-index-i', number: 4284, files: ['Notes.md', 'README.md', 'smallest-stable-index-i.java'] },
  { folder: '4285-smallest-stable-index-ii', number: 4285, files: ['Notes.md', 'README.md', 'smallest-stable-index-ii.java'] },
]

// ============================================
// Derived selectors
//
// Every figure the artifact prints comes from one of these. They are computed
// from `dsaArchive` and `rootFiles` at module load, so there is no number in this
// codebase that a human typed and then had to remember to keep correct.
// ============================================

/** Every file in the repository, folders and root alike. */
const allFiles: string[] = [...dsaArchive.flatMap((entry) => entry.files), ...rootFiles]

/** Lower-cased file extension of a filename, or null when it has none. */
function extensionOf(filename: string): string | null {
  const dot = filename.lastIndexOf('.')
  if (dot <= 0) return null
  return filename.slice(dot + 1).toLowerCase()
}

/** Counts files whose extension matches, across folders and the root. */
function countByExtension(extension: string): number {
  return allFiles.reduce((total, filename) => (extensionOf(filename) === extension ? total + 1 : total), 0)
}

/** Number of solution folders. This is 131 — not the 132 top-level entries. */
export const solutionFolderCount = dsaArchive.length

/** Total files in the repository, including the root README. */
export const repositoryFileCount = allFiles.length

/** `.java` solution files. */
export const javaFileCount = countByExtension('java')

/** `.py` files. Two folders carry a Python version alongside the Java one. */
export const pythonFileCount = countByExtension('py')

/** `.md` files across the whole repository, including the root README. */
export const markdownFileCount = countByExtension('md')

/** Markdown files stored inside solution folders. */
export const notesFileCount = dsaArchive.reduce(
  (total, entry) => total + entry.files.filter((f) => extensionOf(f) === 'md').length,
  0
)

/** Folders that hold a Java solution. */
export const javaFolderCount = dsaArchive.filter((entry) =>
  entry.files.some((f) => extensionOf(f) === 'java')
).length

/** Folders that hold a Python solution. */
export const pythonFolderCount = dsaArchive.filter((entry) =>
  entry.files.some((f) => extensionOf(f) === 'py')
).length

/** Folders holding a write-up but no solution file of any language. */
export const documentationOnlyFolders = dsaArchive.filter(
  (entry) => !entry.files.some((f) => f.endsWith('.java') || f.endsWith('.py'))
)

/** Folders holding a second `Notes.md` beside their `README.md`. */
export const foldersWithExtraNotes = dsaArchive.filter((entry) =>
  entry.files.some((f) => f.toLowerCase() === 'notes.md')
).length

/** Lowest and highest LeetCode problem number present. */
export const problemNumberRange = dsaArchive.reduce(
  (range, entry) => ({
    min: Math.min(range.min, entry.number),
    max: Math.max(range.max, entry.number),
  }),
  { min: Number.POSITIVE_INFINITY, max: 0 }
)

/**
 * Languages actually present, most files first, each with its real file count.
 *
 * Built by counting extensions rather than from a list, so a folder added to the
 * manifest changes this without any edit here. Files with no extension would
 * appear as `null`; none exist in this repository, so the filter is defensive.
 */
export const languageBreakdown = (() => {
  const counts = new Map<string, number>()
  allFiles.forEach((filename) => {
    const extension = extensionOf(filename)
    if (!extension) return
    counts.set(extension, (counts.get(extension) ?? 0) + 1)
  })
  return [...counts.entries()]
    .map(([extension, count]) => ({ extension, count }))
    .sort((a, b) => b.count - a.count || a.extension.localeCompare(b.extension))
})()

/** Solution languages, i.e. everything that is not a markdown write-up. */
export const solutionLanguages = languageBreakdown.filter((entry) => entry.extension !== 'md')

/**
 * A short, deterministic index of representative folders for the artifact's
 * scrolling listing.
 *
 * The sample is taken by walking the manifest at a fixed stride rather than
 * hand-picking names, so every folder printed is a real folder and the spread
 * covers early, mid and late problem numbers. The walk is a pure function of the
 * array, so it is identical on every render and every machine.
 */
export function sampleDsaFolders(count: number, stride = 17): DsaArchiveEntry[] {
  const sample: DsaArchiveEntry[] = []
  for (let index = 0; sample.length < count && sample.length < dsaArchive.length; index += stride) {
    sample.push(dsaArchive[index % dsaArchive.length])
  }
  return sample
}

/**
 * A contiguous window of the manifest, wrapping at the end.
 *
 * Used by the artifact's quiet line-cycling so the listing reads like the real
 * folder list moving past, rather than shuffling between arbitrary names.
 */
export function dsaFolderWindow(start: number, size: number): DsaArchiveEntry[] {
  return Array.from({ length: size }, (_, offset) => dsaArchive[(start + offset) % dsaArchive.length])
}
import { readdir, readFile } from 'node:fs/promises';

// Export generated public-demo evidence through logs when Actions artifact storage
// is full. The submission copy is committed to docs/assignment-11 afterward.
const root = new URL('../docs/assignment-11/', import.meta.url);
const files = ['performance.json', ...(await readdir(new URL('evidence/', root))).map(name => `evidence/${name}`)];
for (const file of files) {
  const encoded = (await readFile(new URL(file, root))).toString('base64');
  const chunks = Math.ceil(encoded.length / 12000);
  for (let index = 0; index < chunks; index++) console.log(`A11_FILE ${file} ${index} ${chunks} ${encoded.slice(index * 12000, (index + 1) * 12000)}`);
}

// Prepara la cartella "pubblica" che Netlify mette online.
// 1. Copia il sito (la cartella public/) in pubblica/.
// 2. Ottimizza le foto della galleria (img/gallery) e del sito (img/site):
//    - raddrizza le foto del telefono (orientamento EXIF)
//    - lato lungo massimo 2000 px, JPG di qualità 82
//    - toglie i metadati, compresa la posizione GPS dello scatto
//    - crea la copia da 900 px nella sottocartella m/ che il sito usa nella griglia e sui telefoni
// Gli originali nel repository restano intatti: si lavora solo sulla copia.
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const RADICE = process.cwd();
const SORGENTE = path.join(RADICE, "public");
const USCITA = path.join(RADICE, "pubblica");
const CARTELLE_FOTO = [path.join(USCITA, "img", "gallery"), path.join(USCITA, "img", "site")];
const LATO_MAX = 2000;
const LATO_COPIA = 900;

async function copiaCartella(da, a) {
  await fs.mkdir(a, { recursive: true });
  for (const voce of await fs.readdir(da, { withFileTypes: true })) {
    const sorgente = path.join(da, voce.name);
    const destinazione = path.join(a, voce.name);
    if (voce.isDirectory()) await copiaCartella(sorgente, destinazione);
    else await fs.copyFile(sorgente, destinazione);
  }
}

function codifica(immagine, estensione) {
  if (estensione === ".png") return immagine.png({ compressionLevel: 9 });
  if (estensione === ".webp") return immagine.webp({ quality: 82 });
  return immagine.jpeg({ quality: 82, mozjpeg: true });
}

async function ridimensiona(dati, lato, estensione) {
  const immagine = sharp(dati, { failOn: "none" })
    .rotate()
    .resize({ width: lato, height: lato, fit: "inside", withoutEnlargement: true });
  return codifica(immagine, estensione).toBuffer(); // senza withMetadata(): EXIF e GPS vengono tolti
}

async function ottimizza(cartella) {
  let nomi;
  try { nomi = await fs.readdir(cartella); } catch { return 0; }
  const foto = nomi.filter((n) => /\.(jpe?g|png|webp)$/i.test(n) && !/\.bak\./i.test(n));
  if (!foto.length) return 0;
  await fs.mkdir(path.join(cartella, "m"), { recursive: true });
  for (const nome of foto) {
    const file = path.join(cartella, nome);
    const estensione = path.extname(nome).toLowerCase();
    const originale = await fs.readFile(file);
    try {
      const [grande, piccola] = await Promise.all([
        ridimensiona(originale, LATO_MAX, estensione),
        ridimensiona(originale, LATO_COPIA, estensione)
      ]);
      await fs.writeFile(file, grande);
      await fs.writeFile(path.join(cartella, "m", nome), piccola);
      console.log(`  ${nome}: ${Math.round(originale.length / 1024)} KB → ${Math.round(grande.length / 1024)} KB (copia ${Math.round(piccola.length / 1024)} KB)`);
    } catch (errore) {
      // una foto illeggibile non deve bloccare la pubblicazione: resta com'è
      console.warn(`  ${nome}: non ottimizzata (${errore.message})`);
    }
  }
  return foto.length;
}

await fs.rm(USCITA, { recursive: true, force: true });
await copiaCartella(SORGENTE, USCITA);
console.log("Sito copiato in pubblica/");
let n = 0;
for (const cartella of CARTELLE_FOTO) n += await ottimizza(cartella);
console.log(`Foto ottimizzate: ${n}`);

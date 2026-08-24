# Sito Fabbro e Serramenti De Ceglia - De Pinto

Sito vetrina statico, **100% gratuito da ospitare per sempre**, con un pannello per aggiungere nuove foto alla galleria in autonomia (senza bisogno di un tecnico).

## Come funziona (in breve)

- Il sito e' fatto di soli file statici (HTML/CSS/JS + due file JSON con i dati della galleria): non serve nessun server a pagamento.
- Il pannello foto si trova su `tuosito.netlify.app/admin` ed e' basato su **Decap CMS**, uno strumento gratuito molto diffuso: quando carichi una foto, viene salvata direttamente nel tuo account **GitHub** (anch'esso gratuito), che e' anche il posto dove vive il codice del sito.
- Il sito e' ospitato su **Netlify** (gratuito): ogni volta che aggiungi/modifichi una foto dal pannello, Netlify ripubblica automaticamente il sito in circa 30-60 secondi.

Nessuno di questi tre servizi (GitHub, Netlify, Decap CMS) richiede una carta di credito per il piano gratuito che useremo.

## Passo 1 - Crea un account GitHub (se non ce l'hai già)

1. Vai su https://github.com/signup e crea un account gratuito
2. Crea un nuovo repository (il "progetto" dove vivra' il codice del sito): pulsante verde "New" in alto a sinistra nella tua pagina GitHub
   - Nome repository: ad esempio `sito-fabbro-de-ceglia-de-pinto`
   - Lascialo "Public" (va bene anche per Netlify gratuito)
   - Non aggiungere README/licenza (li abbiamo gia')
3. Carica il contenuto di questa cartella nel repository. Se non hai familiarita' con Git, il modo piu' semplice e':
   - Sulla pagina del repository appena creato, clicca "uploading an existing file"
   - Trascina dentro tutti i file e le cartelle di questo progetto (tranne la cartella `node_modules`, se presente)
   - Scrivi un messaggio tipo "Primo caricamento del sito" e clicca "Commit changes"

   (Se invece conosci Git da riga di comando, in alternativa: `git init`, `git add .`, `git commit -m "primo caricamento"`, `git branch -M main`, `git remote add origin <url-del-tuo-repo>`, `git push -u origin main`)

## Passo 2 - Collega il repository a Netlify

1. Vai su https://app.netlify.com/signup e registrati gratuitamente (puoi accedere direttamente con il tuo account GitHub, e' piu' veloce)
2. Clicca "Add new site" → "Import an existing project" → "Deploy with GitHub"
3. Autorizza Netlify ad accedere a GitHub, poi seleziona il repository che hai appena creato
4. Nelle impostazioni di build lascia tutto come suggerito automaticamente (il file `netlify.toml` incluso nel progetto dice gia' a Netlify di pubblicare la cartella `public`)
5. Clicca "Deploy site"

Dopo un minuto circa, Netlify ti dara' un indirizzo tipo `nome-a-caso-123.netlify.app`: il tuo sito e' online! (Piu' avanti, dalle impostazioni del sito su Netlify, puoi anche collegare un dominio tuo come `www.tuaazienda.it`, sempre gratuitamente per la parte Netlify - il dominio in se' ha un costo separato se non ne hai gia' uno.)

## Passo 3 - Attiva il login del pannello foto (GitHub come sistema di accesso)

Il pannello `/admin` chiede di accedere con GitHub prima di far modificare le foto. Per attivarlo:

1. Su GitHub, vai su **Settings** (del tuo account, in alto a destra) → **Developer settings** → **OAuth Apps** → **New OAuth App**
   - Application name: es. "Sito Fabbro De Ceglia De Pinto"
   - Homepage URL: l'indirizzo del tuo sito Netlify (es. `https://nome-a-caso-123.netlify.app`)
   - Authorization callback URL: `https://api.netlify.com/auth/done`
   - Clicca "Register application"
2. Nella pagina dell'app appena creata, copia il **Client ID** e genera/copia un **Client Secret**
3. Su Netlify, vai nel tuo sito → **Site configuration** → **Access & security** (o "Identity/OAuth" a seconda della versione) → cerca la sezione **OAuth** → "Install provider" → scegli **GitHub** → incolla Client ID e Client Secret

## Passo 4 - Modifica il file di configurazione del pannello

Nel progetto, apri il file `public/admin/config.yml` e sostituisci:

```
repo: TUO-UTENTE/TUO-REPO
```

con il tuo utente e nome del repository GitHub reali, ad esempio:

```
repo: mariorossi/sito-fabbro-de-ceglia-de-pinto
```

Salva, carica di nuovo questo file su GitHub (basta sostituirlo dalla pagina del repository: apri il file, icona matita "Edit", incolla il contenuto aggiornato, "Commit changes"). Netlify ripubblichera' automaticamente il sito con la modifica.

## Passo 5 - Usa il pannello foto

Vai su `tuosito.netlify.app/admin`, clicca "Login with GitHub", autorizza l'accesso: sei dentro.

- **Galleria foto** → **Foto della galleria**: qui vedi l'elenco di tutte le foto, in ordine
- Clicca su una voce per modificarne descrizione, categoria o sostituire l'immagine
- Il pulsante "+" in basso aggiunge una nuova foto: scegli la categoria, scrivi una breve descrizione, carica l'immagine
- Puoi trascinare le foto per cambiarne l'ordine di visualizzazione
- Ogni modifica si pubblica subito (bottone in alto "Publish" se richiesto)

Le foto caricate restano per sempre (sono salvate nel tuo repository GitHub), nessun limite di tempo o di spazio ragionevole per un sito come questo.

## Provare il sito in locale prima di pubblicare (facoltativo)

Se vuoi vedere il sito sul tuo computer prima di caricarlo online:

```bash
npm install
npm start
```

poi apri http://localhost:3000. Nota: in locale la sezione `/admin` si apre ma il login non funzionera' (richiede l'hosting online configurato ai passi precedenti).

## Personalizzazioni rapide

- **Numeri di telefono e WhatsApp**: costanti `PHONE_1`, `PHONE_2` in `public/js/main.js`
- **Indirizzo**: cerca "Via Prolungamento Caduti sul Mare" in `public/index.html` (compare anche nel link della mappa: aggiungere la citta' rende la mappa piu' precisa)
- **Testi "Chi siamo" e servizi**: modificabili in `public/index.html`
- **Colori**: variabili all'inizio di `public/css/style.css` (sezione `:root`)
- **Categorie della galleria**: sono definite sia in `public/data/categories.json` (per le etichette mostrate sul sito) sia nelle opzioni del campo "Categoria" in `public/admin/config.yml` (per il menu a tendina nel pannello) - se rinomini una categoria, aggiornali in entrambi i punti

## Domande frequenti

**Posso perdere le foto caricate?**
No: sono salvate nel tuo repository GitHub, non su un server che si puo' "spegnere". E' lo stesso principio con cui GitHub conserva il codice di milioni di progetti gratuitamente.

**Il sito puo' andare lento o "addormentarsi"?**
No: essendo un sito statico su Netlify (non un server sempre acceso), e' sempre veloce e disponibile, senza tempi di attesa iniziali.

**Quanto mi costa nel tempo?**
Zero, nei limiti (molto ampi per un sito di questo tipo) dei piani gratuiti di GitHub e Netlify. L'unica voce a pagamento eventuale e' se in futuro vuoi un dominio personalizzato tipo `www.tuaazienda.it` (il dominio si compra a parte, circa 10-15 euro/anno; Netlify resta gratis).

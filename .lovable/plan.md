# Meteo, Imperdibili e "Se piove"

Tre aggiunte leggere, opzionali, mobile-first. Nessuna modifica al disegno di Nyhavn o alle animazioni esistenti.

## 1. Meteo: DMI radar + YR
- Una card compatta **"Che tempo fa?"** in "Cose da sapere", con un breve consiglio onesto: a Copenaghen la pioggia spesso dura pochi minuti, quindi conviene guardare il radar e non la percentuale.
- Due pulsanti a pillola che si aprono in una nuova scheda:
  - **Radar DMI** (precipitazioni in tempo reale, dmi.dk)
  - **YR** (previsione oraria per Copenaghen, yr.no)
- Una riga "Buono a sapersi" con i suggerimenti: app DMI Vejr / YR, uno strato impermeabile al posto dell'ombrello (vento).
- Niente widget incorporati o script esterni: solo link, quindi la pagina resta veloce.

## 2. Imperdibili (segnalibro)
- Un piccolo nastro/segnalibro **"Imperdibile"** nell'angolo delle card scelte da Pietro, distinto dalla stella dei preferiti (la stella resta personale del visitatore, il segnalibro è il consiglio di Pietro).
- Una pillola **"Solo imperdibili"** accanto alla ricerca per mostrare solo quelle card; funziona insieme alla ricerca.
- Sulla mappa, gli imperdibili hanno un piccolo segno sul pin e compaiono nello stesso filtro.
- Si attiva dal YAML con una sola riga sulla voce (es. `mustSee: true`), quindi facile da modificare.
- Proporrò una prima lista di 10–15 posti già presenti nella guida; Pietro la conferma o la corregge prima della pubblicazione.

## 3. Se piove
- Una pillola **"Se piove"** accanto a "Solo imperdibili" che mostra solo i posti al chiuso (musei, saune, mercati coperti, caffè, negozi, ecc.).
- Un piccolo simbolo "al chiuso" sulle card interessate.
- Si attiva dal YAML con `indoor: true` sulle voci esistenti.
- Una card **"Piano B per la pioggia"** in "Ispirazione" con 3–4 idee brevi e veritiere (es. musei, saune con bagno caldo, mercati coperti), rimandando alle card già presenti.
- Eventuali nuovi posti al chiuso (es. Palmehuset, Cisternerne) solo se Pietro conferma: nessun locale aggiunto da liste non verificate.

## Presentazione
- Le pillole filtro stanno in una riga scorrevole sotto la ricerca, bersagli da 44px, leggibili per tutte le età.
- Testi in italiano e inglese, brevi e un po' simpatici, senza informazioni inventate.
- Quando un filtro è attivo, un piccolo "Mostra tutto" per tornare indietro.

## Dettagli tecnici
- Campi opzionali `mustSee` e `indoor` nel tipo delle voci della guida; nuove etichette nei file YAML EN/IT.
- Stato dei filtri gestito insieme alla ricerca esistente; filtri combinabili (ricerca + imperdibili + pioggia).
- Il segno imperdibile passa anche ai luoghi della mappa.
- Rigenerare i file markdown per gli LLM includendo "Imperdibile" / "Al chiuso".
- Verifica su telefono (390px): nessun overflow orizzontale, filtri, card e mappa funzionanti in entrambe le lingue.

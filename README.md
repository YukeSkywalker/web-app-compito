# Web App Shop – Progetto Full Stack

## Descrizione

Questo progetto è una web application full-stack che simula uno shop online con sistema di crediti virtuali.

Gli utenti possono registrarsi, effettuare il login, visualizzare i prodotti disponibili, aggiungerli al carrello e completare acquisti utilizzando i crediti disponibili.

L'applicazione include anche una dashboard amministratore (Admin) che permette di gestire prodotti, utenti e visualizzare lo storico degli acquisti.

Il progetto utilizza una architettura separata:

- Frontend
- Backend API
- Database

---

# Architettura

L'applicazione è strutturata nel seguente modo:


Frontend (GitHub Pages)
↓
API REST (Node.js + Express)
↓
Database (Supabase PostgreSQL)


Il frontend comunica con il backend tramite **fetch API** utilizzando richieste HTTP in formato JSON.

---

# Tecnologie utilizzate

Frontend:

- HTML
- CSS
- JavaScript (Vanilla JS)

Backend:

- Node.js
- Express

Database:

- Supabase (PostgreSQL)

---

# Funzionalità principali

## Utente

Un utente può:

- registrarsi
- effettuare login
- visualizzare i prodotti nello shop
- aggiungere prodotti al carrello
- modificare le quantità nel carrello
- acquistare prodotti con i propri crediti
- riscattare un codice promozionale

---

## Admin

L'admin può accedere ad una dashboard dedicata che permette di:

- aggiungere nuovi prodotti
- modificare nome, prezzo e quantità dei prodotti
- eliminare prodotti
- visualizzare tutti gli utenti
- modificare i crediti degli utenti
- visualizzare lo storico degli acquisti

---

# Struttura del progetto


project
│
├── frontend
│ ├── index.html
│ ├── admin.html
│ ├── cart.html
│ │
│ ├── css
│ │ └── style.css
│ │
│ └── js
│ ├── app.js
│ ├── cart.js
│ ├── admin.js
│ ├── auth.js
│ ├── coupon.js
│ └── config.js
│
└── backend
├── server.js
└── supabase.js


---

# Sistema crediti

Ogni utente registrato riceve automaticamente:


100 crediti iniziali


I crediti vengono utilizzati per acquistare prodotti nello shop.

Quando un ordine viene effettuato:

- i crediti dell'utente vengono scalati
- lo stock dei prodotti viene aggiornato
- lo storico acquisti viene salvato nel database

---

# Codice promozionale

È possibile riscattare un codice promozionale che permette di ottenere crediti aggiuntivi.

### Codice promo


price2x


Il codice aggiunge:


+200 crediti


Il codice può essere utilizzato **una sola volta per utente**.

---

# Credenziali Admin

Per accedere alla dashboard amministratore utilizzare:


email: admin@mail.com

password: admin123


---

# Nota tecnica su Supabase

Durante l'utilizzo dell'applicazione può verificarsi un leggero ritardo nell'aggiornamento dei dati.

Questo comportamento è dovuto al fatto che Supabase è un database cloud e potrebbe richiedere qualche istante per sincronizzare i dati tra backend e frontend.

In alcuni casi quindi:

- i crediti potrebbero aggiornarsi con un piccolo ritardo
- lo stock dei prodotti potrebbe richiedere un refresh della pagina

Questo comportamento è normale quando si utilizza un database remoto.

---

# Obiettivo del progetto

Lo scopo del progetto è dimostrare la realizzazione di una applicazione web completa con architettura:

- frontend
- backend
- database

utilizzando API REST e comunicazione JSON tra client e server.

## Demo

Frontend:
[https://TUOUSERNAME.github.io/NOME-REPOSITORY/](https://yukeskywalker.github.io/web-app-compito/login.html)

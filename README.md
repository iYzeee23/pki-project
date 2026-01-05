## Setup & Testiranje (minimalni stack: REST + Socket.IO + JWT + Mongo + Web/Mobile)

### 1) Instalirati Node.js
https://nodejs.org/en/download

### 2) Instalirati MongoDB i pokrenuti server
https://www.mongodb.com/try/download/community  
**Services => MongoDB Server => Start the service**

### 3) Instalirati Expo Go na iPhone
AppStore => Expo Go

### 4) Instalirati potrebne zavisnosti
```bash
cd "%reporoot%"
npm install --workspaces
```

### 5) Podesiti .env varijable
Postoje primeri (.env.example) za svaki od njih

### 6) Proveriti da li radi server [Node.js + Express]
```bash
npm --workspace ./Server run dev
```
**Browser => http://localhost:3000/health => {"ok":true}**

### 7) Proveriti da li radi REST + JWT
```bash
curl -X POST http://localhost:3000/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin\"}"

curl http://localhost:3000/secret ^
  -H "Authorization: Bearer <TOKEN>"
```
**{"ok":true, ...}**

### 8) Proveriti da li radi Socket.IO
```bash
node .\Server\scripts\test.js
```
**server => [socket] connected**
**terminal => connected i pong**

### 9) Proveriti da li radi Mongo + Socket event
```bash
curl -X POST http://localhost:3000/notes ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer <TOKEN>" ^
  -d "{\"text\":\"Hello\"}"
```
**terminal => note_created**
```bash
curl http://localhost:3000/notes ^
  -H "Authorization: Bearer <TOKEN>"
```
**{"notes":[...]}**

### 10) Proveriti da li radi Web app [React + Leaflet]
```bash
npm --workspace ./Web run dev
```
**http://localhost:5173/ => treba da se iscrta minijaturna mapa**

### 11) Proveriti da li radi Mobile app [React Native + Expo]
```bash
npm --workspace ./Mobile run start
```
**skenirati QR kod kamerom => u Expo Go treba da se iscrta mapa**

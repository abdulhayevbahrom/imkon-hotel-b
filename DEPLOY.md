# Contabo serverga deploy

## 1. Serverni bir marta tayyorlash

Serverda Node.js, Git va PM2 o'rnatilgan bo'lishi kerak. Keyin loyihani klonlang:

```bash
sudo npm install -g pm2
git clone https://github.com/abdulhayevbahrom/imkon-hotel-b.git /var/www/imkon-hotel-backend
cd /var/www/imkon-hotel-backend
cp .env.example .env
nano .env
npm ci --omit=dev
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

`pm2 startup` chiqargan `sudo ...` buyrug'ini ham bir marta bajaring. Bu server
qayta yoqilganda backendni avtomatik ishga tushiradi.

`.env` ichida kamida quyidagilarni haqiqiy qiymatlar bilan kiriting:

```dotenv
PORT=8100
MONGO_URI=mongodb://127.0.0.1:27017/imkon-hotel
JWT_SECRET_KEY=uzun-va-maxfiy-kalit
CLIENT_ORIGINS=https://imkon.my-hotels.uz
```

Repo private bo'lsa, Contabo serverdagi SSH public key'ni GitHub repository
`Settings -> Deploy keys` bo'limiga read-only key sifatida qo'shing. Shunda
serverdagi `git pull` autentifikatsiyadan o'tadi.

## 2. GitHub Actions secretlarini kiriting

GitHub repository `Settings -> Secrets and variables -> Actions` bo'limiga:

- `CONTABO_HOST` — server IP yoki domeni
- `CONTABO_PORT` — SSH porti, odatda `22`
- `CONTABO_USER` — SSH foydalanuvchisi
- `CONTABO_SSH_KEY` — shu foydalanuvchiga kiradigan private SSH key
- `CONTABO_PROJECT_PATH` — `/var/www/imkon-hotel-backend`

Private key'ga mos public key Contabo serverdagi
`~/.ssh/authorized_keys` faylida bo'lishi kerak.

Shundan keyin `main` branch'ga har bir push GitHub Actions orqali serverda
`scripts/deploy.sh` ni bajaradi. U `git pull --ff-only`, `npm ci --omit=dev` va
PM2 restartni ketma-ket bajaradi.

## Foydali buyruqlar

```bash
pm2 status
pm2 logs imkon-hotel-backend
pm2 restart imkon-hotel-backend
```

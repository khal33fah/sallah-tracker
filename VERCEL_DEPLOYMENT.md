# Deploying Salah Tracker & Prayer Mat Scanner to Vercel

This application is architected to run seamlessly both as a **high-performance Web App** and as an **installable "Normal App" (Progressive Web App - PWA)** on phones (iOS and Android), tablets, and desktops.

---

## 🚀 Option 1: Deploy to Vercel via GitHub (Recommended)

1. **Push your code to GitHub / GitLab / Bitbucket**:
   If you have exported or connected this project to GitHub, make sure your latest commits are pushed.

2. **Go to [vercel.com/new](https://vercel.com/new)**:
   - Sign in with your GitHub account.
   - Select and import your repository.

3. **Configure Project Settings**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (default)
   - **Build Command**: `vite build` (or leave default `npm run build`)
   - **Output Directory**: `dist`

4. **Environment Variables**:
   Under **Environment Variables**, add:
   - `GEMINI_API_KEY`: *(Optional)* Your Google Gemini API key for AI-powered prayer mat vision and dynamic lock screen reflections. (Note: The app includes built-in authentic Islamic fallbacks, so the app will never crash even without this key).

5. **Click "Deploy"**:
   Vercel will build your web application in seconds and provide a production HTTPS URL (e.g., `https://salah-tracker.vercel.app`).

---

## ⚡ Option 2: Deploy to Vercel via Vercel CLI

If you have the Vercel CLI installed locally:

```bash
# 1. Install Vercel CLI if you haven't already
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy to preview
vercel

# 4. Deploy to production
vercel --prod
```

---

## 📱 How Users Install It as a "Normal App" on Their Phone

Once published on Vercel (or when accessing the web link):

### On Android & Google Chrome / Edge / Brave:
1. Open your Vercel URL in your mobile browser.
2. Tap the **"Install to Device"** banner or **"Install App"** in the top navigation bar.
3. Confirm **"Install"**.
4. The **Salah Tracker** icon will appear on your phone home screen and in your app drawer, opening in full-screen standalone mode without any browser URL bar.

### On Apple iPhone & iPad (Safari):
1. Open your Vercel URL in Safari.
2. Tap the **Share** button (the square icon with an upward arrow at the bottom).
3. Scroll down and tap **"Add to Home Screen"** (`+`).
4. Tap **"Add"** in the top-right corner.
5. The app launches full-screen with native app performance, prayer mat camera verification, and offline library support.

---

## 📴 Offline Support
- All five daily prayer calculations, Qibla compass calculations, Quran Surahs, Hadith collections, and Islamic books are precached and work 100% offline.

# 🎬 Convertisseur Vidéo MP4 vers HTML5

Application web moderne pour convertir des vidéos MP4 en formats HTML5 optimisés (MP4 H.264 ou WebM VP9) directement dans le navigateur.

## ✨ Fonctionnalités

- 📤 **Upload par glisser-déposer** - Interface intuitive
- 🔄 **Conversion locale** - Tout dans le navigateur (FFmpeg.wasm)
- 🎨 **Options personnalisables** - Format, qualité, résolution
- 👀 **Aperçu en direct** - Visualisez avant de télécharger
- 💻 **Code HTML5 généré** - Copiez/collez directement
- 🔒 **100% sécurisé** - Aucune donnée envoyée à un serveur
- ⚡ **Sans backend** - Fonctionne complètement côté client

## 🛠️ Stack Technique

- **React 18** - Framework UI
- **TypeScript** - Sécurité des types
- **Vite** - Build rapide
- **FFmpeg.wasm** - Conversion vidéo dans le navigateur
- **CSS Modules** - Styling scopé

## 📋 Prérequis

- Node.js 18+ et npm/yarn
- Navigateur moderne (Chrome, Edge, Firefox)

## 🚀 Installation

1. **Clonez ou naviguez vers le dossier:**
   ```bash
   cd video-to-html5-converter
   ```

2. **Installez les dépendances:**
   ```bash
   npm install
   ```

3. **Lancez le serveur de développement:**
   ```bash
   npm run dev
   ```

4. **Ouvrez votre navigateur:**
   ```
   http://localhost:5173
   ```

## 📦 Build pour Production

```bash
npm run build
```

Les fichiers optimisés seront dans le dossier `dist/`.

## 🌍 Déploiement Gratuit

### Option 1: Vercel (Recommandé)
```bash
# Installer Vercel CLI
npm install -g vercel

# Déployer
vercel
```

### Option 2: Netlify
```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Build et déploiement
npm run build
netlify deploy --prod --dir=dist
```

### Option 3: GitHub Pages
1. Poussez le code vers GitHub
2. GitHub Actions déploiera automatiquement (fichier `.github/workflows/deploy.yml` inclus)
3. Activez GitHub Pages dans Settings → Pages → Source: gh-pages

### Option 4: Cloudflare Pages
1. Connectez votre repo GitHub à Cloudflare Pages
2. Build command: `npm run build`
3. Output directory: `dist`

**Note importante:** Les headers CORS sont configurés dans `vercel.json` et `public/_headers` pour que FFmpeg.wasm fonctionne correctement.

## 🎯 Utilisation

1. **Uploadez une vidéo** - Glissez-déposez ou cliquez pour sélectionner
2. **Choisissez les options**:
   - Format (MP4 ou WebM)
   - Qualité (haute, moyenne, basse)
   - Résolution personnalisée (optionnel)
3. **Convertissez** - Cliquez sur "Convertir en HTML5"
4. **Téléchargez** - Récupérez votre vidéo convertie
5. **Copiez le code HTML5** - Intégrez sur votre site web

## 🔒 Sécurité

- ✅ Validation stricte des types de fichiers
- ✅ Sanitization des noms de fichiers
- ✅ Limite de taille (500MB max)
- ✅ Pas de stockage serveur
- ✅ Conversion 100% locale

## 📄 Formats Supportés

### Entrée
- MP4, WebM, MOV, AVI, MKV

### Sortie
- **MP4 (H.264)** - Meilleure compatibilité navigateurs
- **WebM (VP9)** - Meilleure compression, taille réduite

## 🌐 Compatibilité

- Chrome 90+
- Edge 90+
- Firefox 90+
- Safari 15+ (support limité pour WebM)

## 📝 Notes Importantes

- La première conversion prend plus de temps (chargement FFmpeg)
- Les grosses vidéos peuvent être lentes à convertir
- Utilisez Chrome/Edge pour les meilleures performances
- La conversion WebM est plus lente mais produit des fichiers plus petits

## 🤝 Contribution

Ce projet est open-source. N'hésitez pas à contribuer!

## 📜 Licence

MIT

## 🆘 Support

Pour toute question ou problème, ouvrez une issue sur GitHub.

---

Fait avec ❤️ en TypeScript et React

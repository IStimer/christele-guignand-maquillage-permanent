# Christèle Guignand - Landing Page

Landing page premium pour Christèle Guignand, experte en maquillage permanent (dermopigmentation) depuis 2004.

## Structure du projet

```
/
├── index.html                    # Page principale
├── assets/
│   ├── css/
│   │   └── styles.css           # Styles avec variables CSS
│   └── js/
│       └── main.js              # Lenis smooth scroll + GSAP animations
├── favicon.ico                  # À ajouter
└── README.md                    # Ce fichier
```

## Technologies utilisées

- **HTML5** sémantique avec accessibilité (ARIA)
- **CSS3** avec Custom Properties (variables CSS)
- **JavaScript** vanilla (ES6+)
- **GSAP 3.12** - Animations et ScrollTrigger
- **Lenis** - Smooth scroll premium
- **Google Fonts** - Cormorant Garamond + Montserrat

## Fonctionnalités

### Design
- Palette pastel premium (rose poudré, beige, or rose)
- Typographie élégante (serif pour les titres, sans-serif pour le corps)
- Design responsive mobile-first
- Formes organiques et ombres légères

### Animations
- Révélation du titre au chargement
- Animations scroll avec ScrollTrigger
- Timeline animée avec progression
- Compteur animé (21 ans d'expérience)
- Custom cursor sur desktop
- Boutons magnétiques

### Accessibilité
- Support `prefers-reduced-motion`
- Navigation au clavier
- Attributs ARIA
- Contrastes respectés

### SEO
- Meta tags complets (Open Graph, Twitter Cards)
- JSON-LD structuré (BeautySalon)
- Sémantique HTML5

## Lancer le projet

### Option 1 : Ouvrir directement
```bash
open index.html
```

### Option 2 : Serveur local (recommandé)
```bash
# Avec Python 3
python3 -m http.server 8000

# Puis ouvrir http://localhost:8000
```

### Option 3 : Live Server (VS Code)
Installer l'extension "Live Server" et cliquer sur "Go Live"

## Personnalisation

### Couleurs
Les couleurs sont définies dans `assets/css/styles.css` via des variables CSS :

```css
:root {
    --rose-poudre: #E8D5D5;
    --beige-rose: #F5EBE6;
    --taupe-doux: #C4B7A6;
    --rose-ancien: #D4A5A5;
    --blanc-casse: #FAF8F6;
    --gris-anthracite: #2D2D2D;
    --or-rose: #B8A089;
}
```

### Typographie
```css
:root {
    --font-serif: 'Cormorant Garamond', serif;
    --font-sans: 'Montserrat', sans-serif;
}
```

### Images
Les images proviennent d'Unsplash et sont chargées via leurs URLs. Pour utiliser vos propres images :

1. Remplacer les URLs dans `index.html`
2. Optimiser les images (format WebP recommandé)
3. Ajouter les attributs `width` et `height` pour le CLS

## Contact

- **Téléphone** : 06 68 29 06 48
- **Email** : guignand.christele@gmail.com
- **Localisation** : Saint-Etienne, France

## Performance

Pour de meilleures performances en production :

1. Minifier CSS et JS
2. Compresser les images localement
3. Activer la compression GZIP sur le serveur
4. Mettre en cache les assets statiques

## Licence

© 2024 Christèle Guignand - Tous droits réservés

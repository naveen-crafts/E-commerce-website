# NK – E-commerce Website

A responsive fashion store front-end built with plain **HTML, CSS and JavaScript** (no build step, no dependencies).

## ✨ Features (v2.0.0)

- Responsive layout with a sticky navbar and mobile menu
- Product catalogue rendered from JavaScript (12 products)
- Category filter, live search and price/name sorting
- Shopping cart drawer with quantity controls and totals (saved in `localStorage`)
- Wishlist hearts (saved in `localStorage`)
- Dark / light mode (remembers your choice, follows system by default)
- Newsletter form with email validation
- Toast notifications, back-to-top button and scroll animations
- Optimised WebP images (about 12 MB → under 1 MB), lazy loading
- SEO meta tags, accessible labels, keyboard support and reduced-motion support

## 🚀 Run locally

Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## 🌐 Deploy on GitHub Pages

Repo **Settings → Pages → Deploy from a branch → `main` / root**.

## 📁 Structure

```
index.html   page markup
E-com.css    styles (light + dark theme)
E-com.js     products, cart, filters, theme
images/      optimised WebP and PNG assets
```

## 🛠 Customising products

Edit the `PRODUCTS` array at the top of `E-com.js` (name, price, category, image file name in `images/`).

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md).

## 👤 Author

Naveen Kumar V B

## 📄 License

[MIT](LICENSE)

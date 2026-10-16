# Order QR - Digital Menu for Restaurants

A simple static landing page + admin panel for restaurants to display menu and take orders via Zalo/Messenger deep link.

## Features

- Mobile-first menu display
- Quantity selection per item
- Customer info form (name, phone, address)
- One‑click order via Zalo deep link (opens Zalo app or web)
- Simple admin panel (CRUD categories & items) backed by a tiny Node.js server that reads/writes `menu.json`
- No database – menu stored as JSON file, easy to edit manually or via admin
- Deploy frontend to GitHub Pages (or any static host); admin runs locally or on any Node host

## Project Structure

```
.
├── index.html          # Customer facing menu + order form
├── menu.json           # Menu data (edited via admin)
├── style.css           # Styles for customer view
├── script.js           # Frontend logic (render menu, handle qty, build Zalo link)
├── server.js           # Tiny Express server (serves admin + API to update menu.json)
├── package.json        # npm dependencies & scripts
└── admin/              # Admin panel files
    ├─ index.html
    ├─ style.css
    └─ script.js
```

## Quick Start (Local Development)

1. **Clone the repo**
   ```bash
   git clone https://github.com/vibecode/order-qr.git
   cd order-qr
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the server**
   ```bash
   npm start
   # or: node server.js
   ```

4. **Open in browser**
   - Customer view: http://localhost:3000/
   - Admin panel:   http://localhost:3000/admin

   Use the admin to edit categories, item names, and prices.  
   After saving, the updated `menu.json` will be written; the customer page will reflect changes on next reload.

5. **Deploy frontend to GitHub Pages (optional)**
   - Push only the static files (`index.html`, `menu.json`, `style.css`, `script.js`) to the `gh-pages` branch or enable GitHub Pages from the `main` branch `/ (root)` folder.
   - The admin panel and `server.js` are **not** needed for the live customer site; they are for menu management only.
   - After each menu edit via admin, run:
     ```bash
     git add menu.json
     git commit -m "Update menu: ..."
     git push
     ```
     GitHub Pages will redeploy automatically.

## Customization

- **Zalo phone number**: Edit `script.js` line where `zaloNumber` is defined. Replace `"+849****4567"` with your actual Zalo Official Account or personal phone number (include country code, e.g., `+84` for Vietnam).
- **Styling**: Adjust `style.css` and `admin/style.css` to match your brand colors.
- **Menu structure**: The JSON format is an array of categories, each with `name` and an array of items (`name`, `price`). Feel free to add fields like `description` or `image` and update the templates accordingly.

## Production Notes

- For public hosting, **do not expose the admin panel** unless you protect it (e.g., basic auth, IP restriction, or run it only on your internal network).  
- The admin panel currently has no authentication; if you need to expose it publicly, add a simple middleware in `server.js` (e.g., `express-basic-auth`).
- The Zalo deep link format used is `zalo://message?phone=NUMBER&text=ENCODED_TEXT`. On desktop browsers without Zalo installed, it will prompt to install Zalo or open the web version if available.

## License

MIT – feel free to fork and adapt.

---
*Created with ❤️ by vibecode*
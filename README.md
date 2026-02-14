# Product Management Dashboard

A **full-featured Product Management Dashboard** built with **Next.js 15+**, **Tailwind CSS**, and **shadcn/ui**.  
Browse, filter, and manage products with a clean, responsive interface that includes light/dark mode support and favorites functionality.

---

## 🚀 Features

### Product List & Filtering
- **Pagination**: Browse products page by page.  
- **Search**: Filter products by name.  
- **Categories**: Filter by product category.  
- **Date Range**: Filter products by "Date Added" using a custom calendar component.

### Date Range Picker
- Built with **shadcn/ui Calendar** and **Popover**.  
- Mock dates generated deterministically based on product ID.  
- Visual feedback with **indigo selection/hover states**.

### Product Detail Page
- Detailed product info: images, price, rating, and stock.  
- **Add to Favorites** button.  
- Fully responsive layout.

### Favorites
- Persisted in **localStorage**.  
- Toggleable from detail views.  
- Visual heart indicator for favorite products.

### Theming
- Fully supported **Light** and **Dark** modes.  
- Consistent styling across all components.  

---

## 💻 Technologies Used
- **Next.js 15+**  
- **React 18+**  
- **Tailwind CSS**  
- **shadcn/ui components**  
- **React Query** for data fetching  
- **DummyJSON API** for mock product data  

---

## ⚙️ Installation & Setup

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/product-dashboard.git
cd product-dashboard
```

2. **Install dependencies**
   
```bash
npm install
# or
pnpm install
```

3. **Run the development server**
   
```bash
npm run dev
# or
pnpm dev
```

4. Open http://localhost:3000 in your browser.

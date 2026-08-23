# CostWise

<img width="1264" height="623" alt="Screenshot 2025-09-23 at 8 31 37 PM" src="https://github.com/user-attachments/assets/c22030a8-1ad4-40c5-8bf3-48a7002868ac" />

CostWise is a web application designed to help users manage their recipes and ingredients, with a focus on cost management and profitability. It allows users to track the cost of ingredients, calculate the total cost of recipes, and determine selling prices based on desired profit margins.

## 🚀 Live Demo

- **Live Site:** [Access Here](https://chat-agent-rosy.vercel.app/)
- **Repository:** [https://github.com/st9ho3/costwise](https://github.com/st9ho3/costwise.git)

---

## 🎯 About

CostWise is a comprehensive solution for managing recipes and ingredients, with a strong emphasis on cost analysis and profitability. This application was built to provide a seamless experience for users to track ingredient costs, calculate recipe expenses, and strategically set selling prices to achieve desired profit margins. The primary users for this application are chefs, home cooks, and small business owners in the food industry.

---

## ✨ Features

- ✅ **Recipe Management:** Create, edit, and delete recipes with detailed information including title, category, and ingredients.
- ✅ **Ingredient Tracking:** Manage a list of ingredients with their unit prices, quantities, and associated suppliers.
- ✅ **Cost Calculation:** Automatically calculate the total cost of a recipe based on the ingredients used.
- ✅ **Pricing and Profitability:** Set selling prices based on either a fixed price or a desired profit margin.
- ✅ **Authentication:** Secure user authentication with credentials and Google OAuth.
- ✅ **File Uploads:** Upload images for recipes.
- ✅ **Supplier Management:** Create and manage suppliers with detailed information including contact details, address, and financial data.
- ✅ **Costwise Design System ("Paper and Produce"):** Tailor-made warm UI design system with 22 custom primitives (`src/app/components/ui/`), warm cream surfaces, broccoli green brand palette, produce accents, and tabular typography.

---

## 🛠️ Tech Stack

### Frontend & Design:

- **React 19** & **Next.js 15** (App Router)
- **TypeScript 5**
- **Tailwind CSS v4** (`@theme` tokens)
- **Costwise UI Primitives** (`src/app/components/ui/`)
- **Zustand** (Global State Management)
- **Lucide React** (Iconography)

### Backend & Database:

- **Next.js API Routes**
- **PostgreSQL** (with `drizzle-orm`)
- **NextAuth.js v5** (OAuth & Credentials)

### Documentation:

Canonical developer documentation is maintained in `docs/`:
- `docs/AGENTS.md` - Operating rules and navigation
- `docs/architecture.md` - Codebase architecture and layout
- `docs/where-to-touch.md` - File routing and edit ownership
- `docs/decisions.md` - Invariants and business constraints
- `docs/ui.md` - Design system guide, tokens, and primitives

---

## 🚀 Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Local Development

1.  **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/project-name.git
    ```

2.  **Navigate to project directory**

    ```bash
    cd project-name
    ```

3.  **Install dependencies**

    ```bash
    npm install
    ```

4.  **Set up environment variables**

    ```bash
    cp .env.example .env
    ```

    Edit `.env` with your configuration.

5.  **Start development server**

    ```bash
    npm run dev
    ```

### Environment Variables

```
DATABASE_URL=your_database_url
AUTH_GOOGLE_ID=your_google_id
AUTH_GOOGLE_SECRET=your_google_secret
```

---

## 💡 Usage

### Basic Usage

After starting the development server, you can create an account, add ingredients with their prices, and then create recipes using those ingredients. The app will automatically calculate the cost of the recipe and help you determine a selling price.

---

## 📚 API Documentation

### Authentication

- **`POST /api/auth/signup`**: Creates a new user account.
- **`POST /api/auth/signin`**: Signs in a user.

### Endpoints

- **`GET /api/recipes`**: Retrieve all recipes for the authenticated user.
- **`POST /api/recipes`**: Create a new recipe.
- **`GET /api/recipes/:id`**: Get a recipe by ID.
- **`PATCH /api/recipes/:id`**: Update a recipe by ID.
- **`DELETE /api/recipes/:id`**: Delete a recipe by ID.
-
- **`POST /api/upload`**: Upload an image for a recipe.

### Suppliers

- **`POST /api/suppliers`**: Create a new supplier.
- **`PATCH /api/suppliers/:id`**: Update a supplier by ID.
- **`DELETE /api/suppliers/:id`**: Delete a supplier by ID.

---

- **`GET /api/ingredients`**: Retrieve all ingredients for the authenticated user.
- **`POST /api/ingredients`**: Create a new ingredient.
- **`GET /api/ingredients/:id`**: Get an ingredient by ID.
- **`PATCH /api/ingredients/:id`**: Update an ingredient by ID.
- **`DELETE /api/ingredients/:id`**: Delete an ingredient by ID.

---

## 🚧 Future Improvements

- [ ] Add user authentication with more OAuth providers.
- [ ] Implement real-time notifications for when an ingredient is running low.
- [ ] Add a chatUI with funtionality fot searching.
- [ ] Add comprehensive test coverage with Jest and React Testing Library.

---

## 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details.

---

## 👤 Contact

- **Panagiotis Stachoulis**
- **Email:** stahos@windowslive.com
- **LinkedIn:** [linkedin.com/in/panagiotis-stachoulis](https://www.linkedin.com/in/panagiotis-stachoulis-586605291?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B1QZJsuE%2FQxWX7HDghoh9yQ%3D%3D)
- **Portfolio:** [pstachoulis.com](https://pstachoulis.com/)
- **GitHub:** [@st9ho3](https://github.com/st9ho3)

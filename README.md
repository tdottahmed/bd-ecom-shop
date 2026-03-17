# True by Malaysia

True by Malaysia is a modern e-commerce management system built with Laravel, React, and Inertia.js. It features a robust administration dashboard for managing products, categories, and orders, with seamless integration with major courier services in Bangladesh.

## 🚀 Tech Stack

- **Backend:** Laravel 12 (PHP 8.2+)
- **Frontend:** React 18 with TypeScript
- **State Management:** Zustand
- **Styling:** Tailwind CSS, PostCSS
- **Communication:** Inertia.js (Inertia React)
- **Icons & UI:** Lucide React, Headless UI, Sonner

## ✨ Core Features

- **Order Management:** Efficient processing of orders with status tracking.
- **Product & Inventory:** Comprehensive management of products, brands, and categories.
- **Courier Integration:** Direct integration with Bangladeshi courier services:
  - [Steadfast Courier](https://steadfast.com.bd/)
  - [Pathao Courier](https://pathaocourier.com.bd/)
  - [RedX](https://redx.com.bd/)
- **Fraud Detection:** Integration with courier fraud checking services.
- **Analytics & Reporting:** Visual insights via Recharts.
- **Image Processing:** Automated image handling with Intervention Image.

## 🛠️ Installation & Setup

### Prerequisites

- PHP >= 8.2
- Composer
- Node.js & NPM
- MySQL/MariaDB

### Local Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd true-by-malaysia
   ```

2. **Install PHP dependencies:**
   ```bash
   composer install
   ```

3. **Install JS dependencies:**
   ```bash
   npm install
   ```

4. **Environment Setup:**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
   *Configure your database and courier credentials in the `.env` file.*

5. **Database Migration:**
   ```bash
   php artisan migrate --seed
   ```

6. **Storage Link:**
   ```bash
   php artisan storage:link
   ```

## 💻 Development Workflow

To start the development environment (Vite + Laravel Server + Queue):

```bash
npm run dev
```

The system uses `concurrently` to run the following services simultaneously:
- Laravel development server
- Vite HMR
- Queue worker
- Laravel Pail (log monitoring)

### Building for Production

```bash
npm run build
```

## 📂 Project Structure (Key Areas)

- `app/Http/Controllers/`: Backend logic and Inertia responses.
- `app/Models/`: Eloquent models for E-commerce data.
- `app/Services/`: External integration logic (Couriers, etc.).
- `resources/js/Pages/`: React frontend pages.
- `resources/js/Components/`: Reusable UI components.
- `routes/admin.php`: Administrative route definitions.

## 📄 License

This project is licensed under the [MIT license](LICENSE).

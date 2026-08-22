# CavyDiet

CavyDiet is a mobile application designed to help guinea pig owners manage daily feeding, nutrition, herd information, and basic health tracking.

The application consists of an Expo / React Native mobile frontend and a Node.js / Express backend connected to a MySQL database.

## Features

### Account

* User registration
* User login
* JWT-based authentication
* Password change
* Automatic session expiration handling
* Login rate limiting

### Herd Management

* Create and delete herds
* Switch between herds
* Manage guinea pigs assigned to each herd
* Maximum herd and guinea pig limits
* Ownership validation for user resources

### Guinea Pig Management

* Add guinea pigs
* Edit guinea pig information
* Delete guinea pigs
* Track current weight
* Upload profile images
* Automatic cleanup of old profile images

### Health Tracking

* Record health checks
* Track guinea pig weight over time
* Add optional health concerns
* Store health history
* Automatically update the guinea pig's current weight after a health check

### Feeding

* Track meals by date
* Navigate between previous days
* Calendar-based feeding history
* Add foods to the currently selected day
* Edit food amounts
* Remove foods from meals
* Automatically combine duplicate food entries

### Nutrition

CavyDiet calculates nutritional values on the backend.

The application tracks:

* Vitamin C
* Calcium
* Phosphorus
* Calcium-to-phosphorus ratio
* Sugar
* High oxalate foods

Food nutritional values are stored per 100 g and calculated according to the amount added to a meal.

### Meal Recommendations

CavyDiet can generate food recommendations based on the current composition of a meal.

Recommendations can consider nutritional values such as:

* Vitamin C
* Calcium
* Calcium-to-phosphorus ratio
* High oxalate content

### Statistics

The application provides feeding and health-related statistics based on stored historical data.

---

## Tech Stack

### Frontend

* Expo
* React Native
* TypeScript
* Expo Router
* Zustand
* AsyncStorage

### Backend

* Node.js
* Express
* MySQL
* mysql2
* bcrypt
* JSON Web Tokens
* Multer
* express-rate-limit
* dotenv
* cors

---

## Project Structure

### Frontend

```text
CavyDiet/
├── app/
│   ├── about/
│   ├── herd-details/
│   ├── info/
│   ├── piggies/
│   ├── settings/
│   ├── feeding.tsx
│   ├── foods.tsx
│   ├── herd-setup.tsx
│   ├── herds.tsx
│   ├── home.tsx
│   ├── index.tsx
│   ├── login.tsx
│   ├── piggy-setup.tsx
│   ├── register.tsx
│   └── statistics.tsx
├── components/
├── constants/
├── store/
├── types/
├── utils/
├── assets/
├── package.json
└── tsconfig.json
```

### Backend

```text
CavyDietBackend/
├── src/
│   ├── middleware/
│   ├── routes/
│   ├── uploads/
│   │   └── piggies/
│   ├── db.js
│   └── server.js
├── .env
├── .env.example
├── .gitignore
├── package.json
└── package-lock.json
```

---

## Architecture

CavyDiet follows a client-server architecture.

### Frontend Responsibilities

The frontend is responsible for:

* Displaying data
* Managing navigation
* Managing local application state
* Sending requests to the backend API
* Displaying loading and error states
* Handling user interaction

### Backend Responsibilities

The backend is responsible for:

* Authentication
* Authorization
* Data validation
* Database operations
* Resource ownership validation
* Nutritional calculations
* Meal recommendations
* Health tracking logic
* File uploads

Nutritional calculations are intentionally performed on the backend rather than the frontend.

---

## Database

CavyDiet uses MySQL.

Main database entities include:

```text
users
herds
guinea_pigs
foods
meals
meal_items
health_check
```

Relationships between entities are protected using foreign keys and cascade rules where appropriate.

Additional database constraints prevent duplicate data such as:

* Multiple meals for the same herd and date
* Duplicate food entries inside the same meal

---

## Authentication

Protected API endpoints use JWT authentication.

Authenticated requests use the following header:

```text
Authorization: Bearer <token>
```

JWT tokens expire after a configured period.

Changing an account password invalidates previously issued sessions.

Protected resources are validated against the authenticated user's ID to prevent access to data belonging to other users.

---

## Environment Variables

The backend requires a `.env` file.

Create it using `.env.example` as a template.

```env
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=

PORT=

JWT_SECRET=
```

Do not commit the real `.env` file to source control.

The repository should only contain:

```text
.env.example
```

with empty or example values.

---

## Backend Setup

Open the backend directory:

```bash
cd CavyDietBackend
```

Install dependencies:

```bash
npm install
```

Configure the `.env` file.

Make sure the MySQL server is running and the required database schema has been created.

Start the backend:

```bash
node src/server.js
```

The API will run on the port configured in:

```env
PORT=
```

---

## Frontend Setup

Open the frontend directory:

```bash
cd CavyDiet
```

Install dependencies:

```bash
npm install
```

Make sure the API address in:

```text
constants/api.ts
```

points to the machine running the CavyDiet backend.

For local Android development using a physical device, the backend should normally be accessed using the computer's local network IP address rather than `localhost`.

Start Expo:

```bash
npx expo start
```

Then open the application using:

* Android emulator
* Expo Go
* Development build

---

## API Overview

The backend contains routes for:

```text
/auth
/herds
/guinea-pigs
/foods
/meals
```

The API provides functionality for:

* Registration and login
* Account management
* Herd management
* Guinea pig management
* Health checks
* Guinea pig images
* Food data
* Daily meals
* Meal editing
* Nutrition summaries
* Meal recommendations
* Feeding statistics

Protected endpoints require a valid JWT.

---

## Security

The application includes several backend security measures:

* Password hashing using bcrypt
* JWT authentication
* JWT expiration
* Session invalidation after password changes
* Login rate limiting
* Resource ownership checks
* Parameterized SQL queries
* Backend input validation
* Restricted image upload types and size
* Environment variables for secrets
* Database constraints for critical data integrity

Sensitive configuration such as database credentials and JWT secrets must never be committed to the repository.

---

## File Uploads

Guinea pig profile images are stored by the backend.

Supported image types include:

```text
JPEG
PNG
WEBP
```

Uploaded files have a maximum allowed size.

When a guinea pig image is replaced, the previous image is removed from storage.

Images are also removed when:

* A guinea pig is deleted
* A herd containing guinea pigs is deleted

---

## Development Approach

CavyDiet is developed incrementally.

The general workflow is:

```text
Backend
↓
API testing
↓
Frontend integration
↓
Testing
↓
Refactoring
↓
Regression testing
```

Business logic is implemented and tested on the backend before being integrated into the frontend.

Large refactors are avoided unless they provide a clear benefit to maintainability or correctness.

---

## Project Status

CavyDiet is currently under active development.

The core functionality for authentication, herd management, guinea pig management, feeding tracking, nutrition calculations, meal recommendations, statistics, health tracking, and image management is implemented and functional.

# seizure-detection

IoT wearable Proof-of-Concept with machine learning for early seizure detection and long-term pattern monitoring in epilepsy patients (Senior Project, Department of Software Engineering, University of Jeddah).

## Repository structure

| Folder | Component | Technology |
| --- | --- | --- |
| `firmware/` | Wearable wristband | ESP32, C++ (Arduino IDE) |
| `mobile-app/` | Patient and caregiver app (Arabic) | React Native with Expo (Android) |
| `web-dashboard/` | Physician dashboard (English) | React with Recharts |
| `backend/` | Detection service and alerts | Python with FastAPI |
| `ml/` | Data preparation, training, and evaluation | Python (scikit-learn, XGBoost) |
| `database/` | Tables and row-level security policies | Supabase (PostgreSQL) |

Setup instructions for each component will be added to its own README when the component is set up.

## Team workflow

1. Create a branch from `dev` for each task, named by type:
   - `feat/<short-name>` for a new feature
   - `fix/<short-name>` for a bug fix
   - `docs/<short-name>` for documentation
   - `chore/<short-name>` for configuration and maintenance
2. Open a Pull Request into `dev` and merge it.
3. New code must include automated tests that pass (Jest for the mobile app and dashboard, pytest for the backend and ML code).
4. Delete the branch after it is merged.
5. After a change is merged into `dev`, open a Pull Request from `dev` into `main`. Another team member reviews and approves it before it is merged into `main`.

## Security and data rules

- **Never commit patient or clinical data.** Datasets stay outside the repository; data files are blocked by `.gitignore`.
- **Never commit secrets.** Copy `.env.example` to `.env` in the same folder and fill in the values locally. `.env` files are ignored by Git.
- The Supabase `service_role` key is used only in `backend/`, never in the mobile app or the dashboard.

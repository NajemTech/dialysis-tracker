
# Dialysis Nutrition Tracker

A clean, professional web application designed to help dialysis patients track their daily nutrient intake and stay within safe medical limits.

## Features

- 📊 **Dashboard** - Real-time tracking of potassium, phosphorus, sodium, and protein intake
- 🍎 **Food Database** - Comprehensive database with 50+ foods including Lebanese dishes
- 📈 **History & Analytics** - Visual charts and trend analysis over time
- ⚙️ **Settings** - Personalized nutrient limits and reminders
- 📄 **Export Summary** - Generate PDF reports for healthcare providers
- 🌐 **Bilingual** - Full support for English and Arabic
- 📱 **Responsive** - Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom medical theme
- **Backend**: Supabase (PostgreSQL + Auth)
- **Charts**: Recharts
- **PDF Export**: jsPDF
- **Routing**: React Router v6

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase project (free tier works fine)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd dialysis-appp
```

2. Install dependencies
```bash
npm install
```

3. Set up Supabase

   - Create a new project at [supabase.com](https://supabase.com)
   - Run the SQL schema provided below in your Supabase SQL Editor
   - Copy your project URL and anon key from Settings → API

4. Configure environment variables

   Copy `.env.example` to `.env` and fill in your Supabase credentials:
```bash
cp .env.example .env
```

   Edit `.env`:
```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

5. Start the development server
```bash
npm run dev
```

   The app will be available at `http://localhost:3000`

## Database Schema

Run this SQL in your Supabase SQL Editor:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table
create table profiles (
  id uuid references auth.users(id) primary key,
  full_name text,
  weight_kg numeric,
  language text default 'en',
  dark_mode boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Nutrient limits table
create table nutrient_limits (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) not null,
  potassium_mg integer not null,
  phosphorus_mg integer not null,
  sodium_mg integer not null,
  protein_g numeric not null,
  water_ml integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Foods table
create table foods (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  name_ar text,
  category text not null,
  category_ar text,
  serving_size text not null,
  serving_size_ar text,
  potassium_mg numeric not null,
  phosphorus_mg numeric not null,
  sodium_mg numeric not null,
  protein_g numeric not null,
  is_default boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Food logs table
create table food_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) not null,
  food_id uuid references foods(id) not null,
  food_name text not null,
  food_name_ar text,
  category text not null,
  category_ar text,
  serving_size text not null,
  serving_size_ar text,
  quantity numeric not null,
  potassium_mg numeric not null,
  phosphorus_mg numeric not null,
  sodium_mg numeric not null,
  protein_g numeric not null,
  meal_type text,
  logged_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Reminders table
create table reminders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) not null,
  title text not null,
  title_ar text,
  type text not null,
  reminder_time text not null,
  enabled boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security
alter table profiles enable row level security;
alter table nutrient_limits enable row level security;
alter table food_logs enable row level security;
alter table reminders enable row level security;

-- Policies
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

create policy "Users can view own nutrient limits" on nutrient_limits
  for select using (auth.uid() = user_id);

create policy "Users can update own nutrient limits" on nutrient_limits
  for update using (auth.uid() = user_id);

create policy "Users can insert own nutrient limits" on nutrient_limits
  for insert with check (auth.uid() = user_id);

create policy "Users can view own food logs" on food_logs
  for select using (auth.uid() = user_id);

create policy "Users can insert own food logs" on food_logs
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own food logs" on food_logs
  for delete using (auth.uid() = user_id);

create policy "Users can view own reminders" on reminders
  for select using (auth.uid() = user_id);

create policy "Users can insert own reminders" on reminders
  for insert with check (auth.uid() = user_id);

create policy "Users can update own reminders" on reminders
  for update using (auth.uid() = user_id);

create policy "Users can delete own reminders" on reminders
  for delete using (auth.uid() = user_id);

-- Public read access for foods
create policy "Anyone can view foods" on foods
  for select using (true);
```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   ├── features/     # Feature-specific components
│   ├── layout/       # Layout components (Header, Footer)
│   └── ui/          # Reusable UI components
├── constants/         # Configuration and data
├── hooks/           # Custom React hooks
├── lib/
│   └── supabase/    # Supabase client and queries
├── pages/           # Page components
└── types/           # TypeScript type definitions
```

## Contributing

This is a solo founder project. Contributions are welcome but please keep it simple and maintain the clean, professional medical aesthetic.

## License

MIT

## Acknowledgments

- Designed for dialysis patients in Lebanon and the Middle East
- Bilingual support (English/Arabic)
- Emergency numbers for Lebanon included
- Lebanese foods database included

## Disclaimer

This application is for informational purposes only. Always consult with your healthcare team for personalized dietary advice.

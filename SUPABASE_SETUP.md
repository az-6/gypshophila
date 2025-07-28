# Supabase Database Schema

## Setup Instructions

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your project URL and keys to `.env.local`
3. Run the following SQL in the Supabase SQL Editor to create the reviews table:

```sql
-- Create reviews table
CREATE TABLE reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  service TEXT NOT NULL CHECK (service IN ('standing-flower', 'standing-banner', 'both')),
  review TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Allow public to insert new reviews (they start as pending)
CREATE POLICY "Allow public to insert reviews" ON reviews
  FOR INSERT WITH CHECK (status = 'pending');

-- Allow public to read approved reviews only
CREATE POLICY "Allow public to read approved reviews" ON reviews
  FOR SELECT USING (status = 'approved');

-- Allow service role (admin) to do everything
CREATE POLICY "Allow service role full access" ON reviews
  FOR ALL USING (auth.role() = 'service_role');
```

## Environment Variables

Add these to your `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Admin Authentication
ADMIN_PASSWORD=gypshophila2024
JWT_SECRET=your-jwt-secret-key-here
```

## For Vercel Deployment

Add the same environment variables to your Vercel project settings:

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add all the variables above

The database will automatically work in production without any file system dependencies.

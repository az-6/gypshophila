# Supabase Setup for Gypshophila Boardy - Fixed Rating Bug

## 🚀 Complete Setup Guide

### 1. Create Supabase Project

1. Go to https://supabase.com
2. Sign up/Login
3. Create New Project: "gypshophila-boardy"
4. Choose region closest to you (Singapore for Indonesia)
5. Wait for setup (2-3 minutes)

### 2. Setup Database Schema

Go to **SQL Editor** and run this:

```sql
-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  service text NOT NULL,
  review text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (approved reviews only)
CREATE POLICY "Anyone can view approved reviews" ON reviews
  FOR SELECT USING (status = 'approved');

-- Create policy for inserting new reviews (public can submit)
CREATE POLICY "Anyone can submit reviews" ON reviews
  FOR INSERT WITH CHECK (status = 'pending');

-- Create policy for admin access (service role key bypasses RLS)
CREATE POLICY "Service role can do everything" ON reviews
  FOR ALL USING (auth.role() = 'service_role');

-- Insert sample data with different ratings to test star display
INSERT INTO reviews (name, email, rating, service, review, status) VALUES
('Sarah Johnson', 'sarah@example.com', 5, 'standing-flower', 'Standing flower yang sangat cantik! 5 bintang untuk kualitas premium.', 'approved'),
('Michael Chen', 'mike@example.com', 4, 'standing-banner', 'Banner design yang profesional. 4 bintang karena sesuai ekspektasi.', 'approved'),
('Andi Pratama', 'andi@example.com', 3, 'both', 'Paket lengkap cukup baik. Rating 3 bintang - perlu improvement.', 'approved'),
('Lisa Wong', 'lisa@example.com', 2, 'standing-flower', 'Kurang memuaskan, hanya 2 bintang. Perlu peningkatan kualitas.', 'approved'),
('Test User', 'test@example.com', 1, 'standing-banner', 'Test review 1 bintang untuk memastikan display rating berfungsi.', 'approved');
```

### 3. Get API Credentials

1. Go to **Settings** → **API**
2. Copy these values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 4. Update .env.local

```env
# Admin Panel Configuration
ADMIN_PASSWORD=gypshophila2024

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# JWT Secret for admin auth
JWT_SECRET=your-jwt-secret-key-here
```

### 5. Test Rating Bug Fix

1. **Start dev server**: `npm run dev`
2. **Visit homepage**: http://localhost:3000
3. **Check sample reviews**: Should show 1, 2, 3, 4, 5 stars correctly
4. **Submit new review**: Choose exactly 3 stars
5. **Check browser console**: Look for debug logs showing rating values
6. **Check admin panel**: http://localhost:3000/admin - should show 3 stars
7. **Approve review**: Rating should remain 3 stars on homepage

### 6. Deploy to Vercel

```bash
# Push to GitHub
git add .
git commit -m "fix: Rating bug fixed with Supabase integration"
git push origin admin+review

# Deploy to Vercel and add environment variables
```

## 🎯 Rating Bug Fixes Applied:

### ✅ **Removed Old System:**

- ❌ Deleted `lib/storage.ts` (file-based storage)
- ❌ Deleted `data/` folder
- ❌ Removed all `fileStorage` imports
- ❌ Cleaned up debug files

### ✅ **Fixed Rating Display Bug:**

- ❌ **Removed emoji ⭐** - Source of the bug! Emoji encoding issues caused incorrect display
- ✅ **Created StarRating component** - Uses SVG stars for consistent rendering
- ✅ **Consistent star display** - Same appearance across all devices and browsers
- ✅ **Interactive rating selection** - Proper visual feedback when selecting ratings

### ✅ **Fixed Rating Handling:**

- ✅ Changed `parseInt()` to `Number()` for proper conversion
- ✅ Added `Number.isInteger()` validation
- ✅ Added debug logging to track rating values
- ✅ Fixed admin state update (`updatedAt` → `updated_at`)

### ✅ **New StarRating Component:**

- ✅ **Reusable component** - `components/ui/star-rating.tsx`
- ✅ **Props support**: `rating`, `size`, `interactive`, `showLabel`
- ✅ **SVG-based stars** - No more emoji encoding issues
- ✅ **Consistent styling** - Same look everywhere

### ✅ **Database Schema:**

- ✅ Rating field is `INTEGER` type with CHECK constraint
- ✅ Sample data includes all rating values (1-5 stars)
- ✅ Proper indexes for performance

## 🐛 **Debugging Steps:**

If rating still shows incorrectly:

1. **Check browser console** during review submission for logs like:

   ```
   Rating received: 3 Type: number
   Rating converted: 3 Type: number
   ```

2. **Check Supabase database** directly:

   - Go to Supabase → Table Editor → reviews
   - Verify rating column shows correct numbers

3. **Test with sample data**:
   - Sample reviews should show 1, 2, 3, 4, 5 stars correctly
   - If not, the issue is in frontend display logic

## 🎉 **Now Production Ready!**

Your review system now:

- ✅ **Correctly handles ratings** (1-5 stars)
- ✅ **Persistent storage** via Supabase PostgreSQL
- ✅ **Scalable** for thousands of reviews
- ✅ **Vercel deployable** with no file system dependencies

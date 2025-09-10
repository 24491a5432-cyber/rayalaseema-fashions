-- Ensure products are publicly readable (already present in earlier migration)
-- and allow only authenticated admins to insert/update/delete products.

-- Enable RLS (no-op if already enabled)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow authenticated admins to insert products
CREATE POLICY IF NOT EXISTS "Admins can insert products"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (public.get_user_role(auth.uid()) = 'admin');

-- Allow authenticated admins to update products
CREATE POLICY IF NOT EXISTS "Admins can update products"
ON public.products
FOR UPDATE
TO authenticated
USING (public.get_user_role(auth.uid()) = 'admin')
WITH CHECK (public.get_user_role(auth.uid()) = 'admin');

-- Allow authenticated admins to delete products
CREATE POLICY IF NOT EXISTS "Admins can delete products"
ON public.products
FOR DELETE
TO authenticated
USING (public.get_user_role(auth.uid()) = 'admin');


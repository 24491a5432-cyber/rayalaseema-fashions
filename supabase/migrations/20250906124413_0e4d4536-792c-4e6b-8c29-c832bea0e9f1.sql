-- Create GST settings table
CREATE TABLE public.gst_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_name TEXT NOT NULL UNIQUE,
  percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.gst_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for GST settings (admin can manage, everyone can read)
CREATE POLICY "Everyone can view GST settings" 
ON public.gst_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert GST settings" 
ON public.gst_settings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update GST settings" 
ON public.gst_settings 
FOR UPDATE 
USING (true);

-- Insert default GST settings
INSERT INTO public.gst_settings (setting_name, percentage, description) VALUES
('andhra_pradesh_gst', 18.0, 'GST rate for Andhra Pradesh (local state)'),
('igst_other_states', 18.0, 'IGST rate for other Indian states'),
('international_gst', 0.0, 'GST rate for international orders');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_gst_settings_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_gst_settings_updated_at
BEFORE UPDATE ON public.gst_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_gst_settings_updated_at_column();
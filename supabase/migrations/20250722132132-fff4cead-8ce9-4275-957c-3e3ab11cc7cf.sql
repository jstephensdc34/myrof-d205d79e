
-- Create patients table for posture assessment
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create posture_assessments table
CREATE TABLE public.posture_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  assessment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create posture_photos table
CREATE TABLE public.posture_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID REFERENCES public.posture_assessments(id) ON DELETE CASCADE NOT NULL,
  photo_type TEXT NOT NULL CHECK (photo_type IN ('side', 'front', 'back')),
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create posture_measurements table
CREATE TABLE public.posture_measurements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID REFERENCES public.posture_assessments(id) ON DELETE CASCADE NOT NULL,
  measurement_type TEXT NOT NULL,
  value DECIMAL(10, 2) NOT NULL,
  unit TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('Normal', 'Mild', 'Moderate', 'Severe')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for patients table
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own patients" 
  ON public.patients 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own patients" 
  ON public.patients 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own patients" 
  ON public.patients 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own patients" 
  ON public.patients 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add RLS policies for posture_assessments table
ALTER TABLE public.posture_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own assessments" 
  ON public.posture_assessments 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assessments" 
  ON public.posture_assessments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessments" 
  ON public.posture_assessments 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assessments" 
  ON public.posture_assessments 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add RLS policies for posture_photos table
ALTER TABLE public.posture_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view photos from their assessments" 
  ON public.posture_photos 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.posture_assessments 
      WHERE posture_assessments.id = posture_photos.assessment_id 
      AND posture_assessments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create photos for their assessments" 
  ON public.posture_photos 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.posture_assessments 
      WHERE posture_assessments.id = posture_photos.assessment_id 
      AND posture_assessments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update photos from their assessments" 
  ON public.posture_photos 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.posture_assessments 
      WHERE posture_assessments.id = posture_photos.assessment_id 
      AND posture_assessments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete photos from their assessments" 
  ON public.posture_photos 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.posture_assessments 
      WHERE posture_assessments.id = posture_photos.assessment_id 
      AND posture_assessments.user_id = auth.uid()
    )
  );

-- Add RLS policies for posture_measurements table
ALTER TABLE public.posture_measurements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view measurements from their assessments" 
  ON public.posture_measurements 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.posture_assessments 
      WHERE posture_assessments.id = posture_measurements.assessment_id 
      AND posture_assessments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create measurements for their assessments" 
  ON public.posture_measurements 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.posture_assessments 
      WHERE posture_assessments.id = posture_measurements.assessment_id 
      AND posture_assessments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update measurements from their assessments" 
  ON public.posture_measurements 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.posture_assessments 
      WHERE posture_assessments.id = posture_measurements.assessment_id 
      AND posture_assessments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete measurements from their assessments" 
  ON public.posture_measurements 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.posture_assessments 
      WHERE posture_assessments.id = posture_measurements.assessment_id 
      AND posture_assessments.user_id = auth.uid()
    )
  );

-- Create storage bucket for posture photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('posture-photos', 'posture-photos', false);

-- Create storage policies for posture photos
CREATE POLICY "Users can view their posture photos" 
  ON storage.objects 
  FOR SELECT 
  USING (
    bucket_id = 'posture-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can upload their posture photos" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'posture-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their posture photos" 
  ON storage.objects 
  FOR UPDATE 
  USING (
    bucket_id = 'posture-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their posture photos" 
  ON storage.objects 
  FOR DELETE 
  USING (
    bucket_id = 'posture-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create trigger for updating updated_at timestamps
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_posture_assessments_updated_at
  BEFORE UPDATE ON public.posture_assessments
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

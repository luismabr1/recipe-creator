-- Esta función debe ser creada en Supabase como una función RPC
CREATE OR REPLACE FUNCTION public.create_recipes_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar si la tabla ya existe
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'recipes'
  ) THEN
    -- Crear la tabla recipes
    CREATE TABLE public.recipes (
      id SERIAL PRIMARY KEY,
      preparacion TEXT NOT NULL,
      vajilla TEXT,
      vida_util TEXT,
      ingredientes JSONB NOT NULL DEFAULT '{}'::jsonb,
      rendimiento TEXT,
      procedimiento TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Configurar RLS (Row Level Security)
    ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

    -- Crear políticas para permitir operaciones CRUD
    CREATE POLICY "Allow select for all users" ON public.recipes
      FOR SELECT USING (true);

    CREATE POLICY "Allow insert for all users" ON public.recipes
      FOR INSERT WITH CHECK (true);

    CREATE POLICY "Allow update for all users" ON public.recipes
      FOR UPDATE USING (true);

    CREATE POLICY "Allow delete for all users" ON public.recipes
      FOR DELETE USING (true);
  END IF;
END;
$$;


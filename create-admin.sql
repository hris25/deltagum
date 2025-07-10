-- Script SQL pour créer un utilisateur admin
-- Exécutez ce script dans votre base de données PostgreSQL

-- Vérifier si l'admin existe déjà
DO $$
DECLARE
    admin_exists INTEGER;
BEGIN
    SELECT COUNT(*) INTO admin_exists 
    FROM customers 
    WHERE email = 'admin@deltagum.com';
    
    IF admin_exists = 0 THEN
        -- Créer l'utilisateur admin
        INSERT INTO customers (
            id,
            email,
            password,
            "firstName",
            "lastName",
            phone,
            address,
            "postalCode",
            city,
            role,
            "createdAt",
            "updatedAt"
        ) VALUES (
            'admin-' || generate_random_uuid()::text,
            'admin@deltagum.com',
            '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3QJflLxQjm', -- admin123
            'Admin',
            'Deltagum',
            '+33123456789',
            '123 Rue de l''Administration',
            '75001',
            'Paris',
            'ADMIN',
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'Utilisateur admin créé avec succès !';
        RAISE NOTICE 'Email: admin@deltagum.com';
        RAISE NOTICE 'Mot de passe: admin123';
    ELSE
        RAISE NOTICE 'L''utilisateur admin existe déjà';
    END IF;
END $$;

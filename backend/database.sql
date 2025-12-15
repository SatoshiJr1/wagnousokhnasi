-- Users table (Admin)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Astuces table
CREATE TABLE IF NOT EXISTS astuces (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial Admin User (password: admin123 - hashed with bcrypt would be better in real app, but for now we might need a script to seed it properly)
-- For this demo, I will not insert a user directly with raw password if we plan to use bcrypt.

-- Seed initial data if tables are empty
INSERT INTO products (name, category, description, price, image)
SELECT 'Plateau Amuse-bouches Royal', 'Amuse-bouches', 'Assortiment de fatayas, nems et acras maison.', 15000, 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=800'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Plateau Amuse-bouches Royal');

INSERT INTO products (name, category, description, price, image)
SELECT 'Seafood Bowl Signature', 'Seafood bowls', 'Riz parfumé, crevettes grillées, calamars, légumes croquants.', 8500, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Seafood Bowl Signature');

INSERT INTO products (name, category, description, price, image)
SELECT 'Bol de Saison Végétarien', 'Vegetarian bowls', 'Quinoa, avocat, patate douce rôtie, sauce tahini.', 6500, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Bol de Saison Végétarien');

INSERT INTO astuces (title, content, image)
SELECT 'Conserver la fraîcheur du poisson', 'Rincez le poisson à l''eau citronnée avant de le congeler pour garder sa texture ferme.', 'https://images.unsplash.com/photo-1535048632866-8a36082b348a?auto=format&fit=crop&q=80&w=800'
WHERE NOT EXISTS (SELECT 1 FROM astuces WHERE title = 'Conserver la fraîcheur du poisson');

INSERT INTO astuces (title, content, image)
SELECT 'Un riz toujours parfait', 'Lavez le riz jusqu''à ce que l''eau soit claire pour enlever l''excès d''amidon et éviter qu''il ne colle.', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800'
WHERE NOT EXISTS (SELECT 1 FROM astuces WHERE title = 'Un riz toujours parfait');

INSERT INTO astuces (title, content, image)
SELECT 'Épices torréfiées', 'Faites chauffer vos épices à sec dans une poêle quelques secondes avant de les utiliser pour décupler leurs arômes.', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800'
WHERE NOT EXISTS (SELECT 1 FROM astuces WHERE title = 'Épices torréfiées');

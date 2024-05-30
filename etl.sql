-- Create tables and import data
-- Drop table if exists
DROP TABLE IF EXISTS pokemon;

-- Create new table
CREATE TABLE pokemon (
  id INT PRIMARY KEY,
  name VARCHAR,
  type_1 VARCHAR,
  type_2 VARCHAR,
  hp INT,
  attack INT,
  defense INT,
  sp_atk INT,
  sp_def INT,
  speed INT,
  generation INT,
  mythical INT,
  legendary INT
);

-- Verify successful data import
SELECT * FROM pokemon;

-- Drop table if exists
DROP TABLE IF EXISTS combats;

-- Create new table
CREATE TABLE combats (
  match_id SERIAL PRIMARY KEY,
  first_pokemon INT,
  --FOREIGN KEY (FIRST_POKEMON) REFERENCES pokemon(ID),
  second_pokemon INT,
  --FOREIGN KEY (SECOND_POKEMON) REFERENCES pokemon(ID),
  winner INT
);

-- Verify successful data import
SELECT * FROM combats;

-- Drop if exists
DROP TABLE IF EXISTS pokemon_combats;

-- Inner Join
SELECT c.match_id,
  c.first_pokemon AS first,
  p.name AS first_name,
  p.type_1 AS first_type_1,
  p.type_2 AS first_type_2,
  p.hp AS first_hp,
  p.attack AS first_attack,
  p.defense AS first_defense,
  p.sp_atk AS first_sp_atk,
  p.sp_def AS first_sp_def,
  p.speed AS first_speed,
  p.generation AS first_generation,
  p.mythical AS first_mythical,
  p.legendary AS first_legendary,
  c.second_pokemon AS second,
  p2.name AS second_name,
  p2.type_1 AS second_type_1,
  p2.type_2 AS second_type_2,
  p2.hp AS second_hp,
  p2.attack AS second_attack,
  p2.defense AS second_defense,
  p2.sp_atk AS second_sp_atk,
  p2.sp_def AS second_sp_def,
  p2.speed AS second_speed,
  p2.generation AS second_generation,
  p2.mythical AS second_mythical,
  p2.legendary AS second_legendary,
  c.winner
INTO pokemon_combats
FROM combats as c
INNER JOIN pokemon AS p ON c.first_pokemon = p.id
INNER JOIN pokemon AS p2 ON c.second_pokemon = p2.id;

-- Verify table
SELECT * FROM pokemon_combats;
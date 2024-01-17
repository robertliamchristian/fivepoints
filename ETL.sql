-- Water
-- Exercise
-- Food
-- Sleep
-- Mindfulness

/* Water */ 
CREATE TABLE five_water (
    id SERIAL PRIMARY KEY NOT NULL,
    amount INT NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL
);

SELECT SUM(amount) AS total FROM five_water WHERE date::date = CURRENT_DATE;
;

create table five_food (
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL,
    calories INT NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL
);
select * from five_food
;

create table five_sleep (
    id SERIAL PRIMARY KEY NOT NULL,
    hours INT NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL
);

create table five_mindfulness (
    id SERIAL PRIMARY KEY NOT NULL,
    minutes INT NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL
);

create table five_exercise (
    id SERIAL PRIMARY KEY NOT NULL,
    type VARCHAR(255) NOT NULL,
    minutes INT NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE five_complete (
    id SERIAL PRIMARY KEY NOT NULL,
    status BOOLEAN NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);



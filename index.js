const express = require('express');
const { Pool } = require('pg'); // Make sure you've installed pg module
const app = express();

const pool = new Pool({
    user: 'iqtbqvpacrddxr',
    host: 'ec2-44-206-18-218.compute-1.amazonaws.com',
    database: 'd1k50gss0f1psn',
    password: 'f8d954a78f946cbba2fa4fef4d6acc5140a455b3afc093afb8d2479065bab910',
    port: 5432,
    ssl: {
        rejectUnauthorized: false // This is often necessary for connections to Heroku Postgres
    }
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
    res.render('index'); // Render the main page
});


// Water
app.post('/addWater', async (req, res) => {
    try {
        const { amount } = req.body;
        const insertQuery = 'INSERT INTO five_water (amount, date) VALUES ($1, NOW())';
        await pool.query(insertQuery, [amount]);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

app.get('/waterConsumedToday', async (req, res) => {
    try {
        const result = await pool.query('SELECT SUM(amount) AS total FROM five_water WHERE date::date = CURRENT_DATE');
        const totalWater = result.rows[0].total || 0; // If no water consumed, default to 0
        res.json({ totalWaterConsumedToday: totalWater });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving water consumption data");
    }
});


// Food
app.post('/addFood', async (req, res) => {
    try {
        const { name, calories } = req.body;
        const insertQuery = 'INSERT INTO five_food (name, calories, date) VALUES ($1, $2, NOW())';
        await pool.query(insertQuery, [name, calories]);
        res.redirect('/'); // Redirect back to the home page or to a success page
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding food entry");
    }
});

app.get('/getFoodToday', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM five_food WHERE date::date = CURRENT_DATE');
        res.json(result.rows); // Send the result as JSON
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving food data");
    }
});

// Sleep
app.post('/addSleep', async (req, res) => {
    try {
        const { hours } = req.body;
        const insertQuery = 'INSERT INTO five_sleep (hours, date) VALUES ($1, NOW())';
        await pool.query(insertQuery, [hours]);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding sleep data");
    }
});

app.get('/getSleepToday', async (req, res) => {
    try {
        const result = await pool.query('SELECT SUM(hours) AS total FROM five_sleep WHERE date::date = CURRENT_DATE');
        const totalSleep = result.rows[0].total || 0; // If no sleep recorded, default to 0
        res.json({ totalSleepToday: totalSleep });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving sleep data");
    }
});


// Mindfulness
app.post('/addMindfulness', async (req, res) => {
    try {
        const { minutes } = req.body;
        const insertQuery = 'INSERT INTO five_mindfulness (minutes, date) VALUES ($1, NOW())';
        await pool.query(insertQuery, [minutes]);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding mindfulness data");
    }
});

app.get('/getMindfulnessToday', async (req, res) => {
    try {
        const result = await pool.query('SELECT SUM(minutes) AS total FROM five_mindfulness WHERE date::date = CURRENT_DATE');
        const totalMindfulness = result.rows[0].total || 0; // If no mindfulness recorded, default to 0
        res.json({ totalMindfulnessToday: totalMindfulness });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving mindfulness data");
    }
});

// Exercise
app.post('/addExercise', async (req, res) => {
    try {
        const { type, minutes } = req.body;
        const insertQuery = 'INSERT INTO five_exercise (type, minutes, date) VALUES ($1, $2, NOW())';
        await pool.query(insertQuery, [type, minutes]);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding exercise data");
    }
});

app.get('/getExerciseToday', async (req, res) => {
    try {
        const result = await pool.query('SELECT type, minutes, date FROM five_exercise WHERE date::date = CURRENT_DATE');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving exercise data");
    }
});


//Check Goals
app.get('/checkDailyGoals', async (req, res) => {
    try {
        const goalCheckQuery = `
            SELECT 
                (SELECT SUM(amount) FROM five_water WHERE date::date = CURRENT_DATE) >= 100 AS water_goal_met,
                (SELECT SUM(calories) FROM five_food WHERE date::date = CURRENT_DATE) < 1766 AS food_goal_met,
                (SELECT SUM(hours) FROM five_sleep WHERE date::date = CURRENT_DATE) >= 6 AS sleep_goal_met,
                (SELECT SUM(minutes) FROM five_mindfulness WHERE date::date = CURRENT_DATE) >= 15 AS mindfulness_goal_met,
                (SELECT SUM(minutes) FROM five_exercise WHERE date::date = CURRENT_DATE) >= 15 AS exercise_goal_met
        `;
        const result = await pool.query(goalCheckQuery);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error checking daily goals");
    }
});


// Complete Goals
app.post('/markComplete', async (req, res) => {
    try {
        const insertQuery = 'INSERT INTO five_complete (status) VALUES (TRUE)';
        await pool.query(insertQuery);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error marking goals as complete");
    }
});

// Get Complete Goals
app.get('/getCompleteCount', async (req, res) => {
    try {
        const result = await pool.query('SELECT COUNT(*) FROM five_complete WHERE status = TRUE');
        res.json(result.rows[0].count);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving completion count");
    }
});

           



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

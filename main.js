require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 3000;

/// Mysql connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

app.use(express.static('public'));

/// Middleware
app.use(bodyParser.json());

// Routes
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})

app.get('/characters', (req, res) => {
  const query = `SELECT c.*, cc.class_name, cc.class_level FROM characters AS c LEFT JOIN character_classes AS cc ON c.id = cc.character_id`;
  pool.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({error: err.message});
    }
    if (res.length === 0) {
      return res.status(404).json({error: "Character not found"});
    }

    // Organize the results by character, aggregating class information for each
    const charactersMap = result.reduce((acc, curr) => {
      // If the character hasn't been added to the accumulator, add it
      if (!acc[curr.id]) {
        acc[curr.id] = {
          ...curr,
          classes: []
        };
      };

      // Add the class information to the accumulator
      if (curr.class_name && curr.class_level) {
        acc[curr.id].classes.push({
          class_name: curr.class_name,
          class_level: curr.class_level
        });
      }

      return acc;
    }, {});

    // Convert the charactersMap to an array and calculate the totoal levels and proficiency bonuses
    const characters = Object.values(charactersMap).map(character => {
      const totalLevel = character.classes.reduce((acc, curr) => acc + curr.class_level, 0);
      character.totalLevel = totalLevel;
      character.proficiencyBonus = calculateProficiencyBonus(character.totalLevel);
      return character;
    })
    res.json(characters);

  })
})

app.get('/characters/:id', (req, res) => {
  const query = `SELECT c.*, cc.class_name, cc.class_level FROM characters AS c LEFT JOIN character_classes AS cc ON c.id = cc.character_id WHERE c.id =?`;
  pool.query(query, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({error: err.message});
    }

    if (result.length === 0) {
      return res.status(404).json({error: "Character not found"});
    }
    const character = result[0];
    const classes = result.map(row => ({
      class_name: row.class_name,
      class_level: row.class_level
    })).filter(classInfo => classInfo.class_name != null); // Filter out null values

    const totalLevel = classes.reduce((acc, curr) => acc + curr.class_level, 0);
    character.totalLevel = totalLevel;
    character.proficiencyBonus = calculateProficiencyBonus(character.totalLevel);
    character.classes = classes.filter((value, index, self) => index === self.findIndex((t) => t.class_name === value.class_name && t.class_level === value.class_level));

    // Since the character data repeats for each class, pick the first one for character info
    const uniqueCharacter = {
      ...character,
      classes: character.classes
    };

    res.json(uniqueCharacter);
  });
});

function calculateProficiencyBonus(level) {
  if (level >= 1 && level <= 4) {
    return 2;
  } else if (level <= 8) {
    return 3;
  } else if (level <= 12) {
    return 4;
  } else if (level <= 16) {
    return 5;
  } else {
    return 6; // Adjust if your game allows levels beyond 20
  }
}
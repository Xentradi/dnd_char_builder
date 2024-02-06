document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id'); // Get the 'id' query parameter if it exists
  let fetchURL = '/characters';

  if (id) {
    fetchURL += `/${id}`; // If an ID is specified, adjust the fetch URL to get a specific character
  }

  fetch(fetchURL)
    .then(response => response.json())
    .then(data => {
      const sheetDisplay = document.getElementById('sheetDisplay');
      if (Array.isArray(data) && data.length > 0) {
        // Handle displaying multiple characters or a single character in an array
        sheetDisplay.innerHTML = data.map(character => createCharacterHtml(character)).join('');
      } else if (data) {
        // Handle displaying a single character not in an array
        sheetDisplay.innerHTML = createCharacterHtml(data);
      }
    })
    .catch(error => console.error('Error fetching data:', error));
});

const skillToAbilityMap = {
  "Acrobatics": "dexterity",
  "Animal Handling": "wisdom",
  "Arcana": "intelligence",
  "Athletics": "strength",
  "Deception": "charisma",
  "History": "intelligence",
  "Insight": "wisdom",
  "Intimidation": "charisma",
  "Investigation": "intelligence",
  "Medicine": "wisdom",
  "Nature": "intelligence",
  "Perception": "wisdom",
  "Performance": "charisma",
  "Persuasion": "charisma",
  "Religion": "intelligence",
  "Sleight of Hand": "dexterity",
  "Stealth": "dexterity",
  "Survival": "wisdom"
};

function calculateModifier(score) {
  return Math.floor((score - 10) / 2);
}
function createCharacterHtml(character) {
  // Calculate modifiers
  const strMod = calculateModifier(character.strength);
  const dexMod = calculateModifier(character.dexterity);
  const conMod = calculateModifier(character.constitution);
  const intMod = calculateModifier(character.intelligence);
  const wisMod = calculateModifier(character.wisdom);
  const chaMod = calculateModifier(character.charisma);

  const proficiencyBonus = character.proficiencyBonus;

  // Display class and level information
  let classLevels = character.classes.map(c => `${c.class_name} (Lvl ${c.class_level})`).join(', ');

  // Generate the skills section based on calculated modifiers, assuming skill data includes proficiency/expertise data
  const skillsHtml = Object.keys(skillToAbilityMap).map(skill => {
    const ability = skillToAbilityMap[skill];
    const abilityMod = calculateModifier(character[ability.toLowerCase()]);
    const isProficient = character.skills[skill]?.proficient;
    const isExpertise = character.skills[skill]?.expertise;
    let totalMod = abilityMod;
    if (isProficient) totalMod += proficiencyBonus;
    if (isExpertise) totalMod += proficiencyBonus;

    return `<li>${skill}: ${totalMod >= 0 ? '+' : ''}${totalMod}</li>`;
  }).join('');


  return `
          <div id="characterSheet">
            <div class="character-info">
              <h2>${character.name} - ${classLevels}</h2>
              <p>Race: ${character.race} | Background: ${character.background} | Alignment: ${character.alignment}</p>
              <p>Total Level: ${character.totalLevel} | Proficiency Bonus: +${proficiencyBonus}</p>
            </div>
            <div class="abilities">
                <h3>Abilities & Modifiers</h3>
                <ul>
                    <li>Strength: ${character.strength} (Modifier: ${strMod})</li>
                    <li>Dexterity: ${character.dexterity} (Modifier: ${dexMod})</li>
                    <li>Constitution: ${character.constitution} (Modifier: ${conMod})</li>
                    <li>Intelligence: ${character.intelligence} (Modifier: ${intMod})</li>
                    <li>Wisdom: ${character.wisdom} (Modifier: ${wisMod})</li>
                    <li>Charisma: ${character.charisma} (Modifier: ${chaMod})</li>
                </ul>
            </div>
            <div class="details">
                <h3>Details</h3>
                <ul>
                    <li>Hit Points: ${character.hit_points}</li>
                    <li>Armor Class: ${character.armor_class}</li>
                    <li>Speed: ${character.speed}</li>
                    <li>Languages: ${character.languages}</li>
                    <li>Equipment: ${character.equipment}</li>
                    <li>Features/Traits: ${character.features_traits}</li>
                </ul>
            </div>
            <div class="skills">
              <h3>Skills</h3>
              <ul>${skillsHtml}</ul>
            </div>
            <!-- Add more sections as needed for skills, spells, etc. -->
          </div>
        `;
}

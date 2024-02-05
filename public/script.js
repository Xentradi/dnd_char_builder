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
      const characterSheet = document.getElementById('characterSheet');
      if (Array.isArray(data) && data.length > 0) {
        // Handle displaying multiple characters or a single character in an array
        characterSheet.innerHTML = data.map(character => createCharacterHtml(character)).join('');
      } else if (data) {
        // Handle displaying a single character not in an array
        characterSheet.innerHTML = createCharacterHtml(data);
      }
    })
    .catch(error => console.error('Error fetching data:', error));
});

function createCharacterHtml(character) {
  // Function to generate HTML for a character
  return `
        <div class="character-info">
            <h2>${character.name}</h2>
            <p><strong>Class & Level:</strong> ${character.level} ${character.class}</p>
            <p><strong>Race:</strong> ${character.race}</p>
            <p><strong>Background:</strong> ${character.background}</p>
            <p><strong>Alignment:</strong> ${character.alignment}</p>
            <div class="stats">
                <h3>Ability Scores</h3>
                <p><strong>Strength:</strong> ${character.strength}</p>
                <p><strong>Dexterity:</strong> ${character.dexterity}</p>
                <p><strong>Constitution:</strong> ${character.constitution}</p>
                <p><strong>Intelligence:</strong> ${character.intelligence}</p>
                <p><strong>Wisdom:</strong> ${character.wisdom}</p>
                <p><strong>Charisma:</strong> ${character.charisma}</p>
            </div>
            <div class="features">
                <h3>Features/Traits</h3>
                <p>${character.features_traits}</p>
            </div>
        </div>
    `;
}

// console.log("connected");

// File Paths & variables
const pokemon_csv = "Resources/pokemon.csv";
let pokemon_data = [];

// Parse the CSV
function load_pokemon() {
  d3.csv(pokemon_csv).then(data => {
    pokemon_data = data;
    let pokemon_names = data.map(row => row.Name);
    populate_dropdown(pokemon_names, '#pokemon1_dropdown', update_pokemon1_stats);
    populate_dropdown(pokemon_names, '#pokemon2_dropdown', update_pokemon2_stats);
  }).catch(error => console.error('Error fetching the CSV file:', error));
}

// Populate dropdowns
function populate_dropdown(pokemon_names, dropdown_id, change_handler) {
  // Sort the names alphabetically
  pokemon_names.sort();

  // Selects the dropdown element
  const dropdown = d3.select(dropdown_id);

  // Appends the name to the dropdown
  dropdown.selectAll('option')
    .data(pokemon_names)
    .enter()
    .append('option')
    .text(d => d)
    .attr('value', d => d);

  // Set the first option as selected
  if (pokemon_names.length > 0) {
    dropdown.property('selectedIndex', 0);
  }

  // Add event listener for dropdown change
  dropdown.on('change', function() {
    const selected_name = dropdown.property('value');
    change_handler(selected_name);
  });

  // Log data for the first option initially
  change_handler(pokemon_names[0]);
}

// Updates Pokemon 1 stats card
function update_pokemon1_stats(selected_name) {
  const selected_pokemon = pokemon_data.find(pokemon => pokemon.Name === selected_name);
  // console.log('Pokemon 1:', selected_pokemon);
  update_pokemon_image(selected_name, "p1_hero_image")

  const is_legendary = selected_pokemon["Legendary"] === "True";

  d3.select("#p1_stats").html(`
    <h4>${selected_pokemon["Name"]} </h4>
    <h5 class="legendary_label">${is_legendary ? "(Legendary)" : ""}</h5>    
    <ul>
      <li><strong>Type 1:</strong>           ${selected_pokemon["Type 1"]}</li>
      <li><strong>Type 2:</strong>           ${selected_pokemon["Type 2"]}</li>
      <li><strong>HP:</strong>               ${selected_pokemon["HP"]}</li>
      <li><strong>Attack:</strong>           ${selected_pokemon["Attack"]}</li>
      <li><strong>Special Attack:</strong>   ${selected_pokemon["Sp. Atk"]}</li>
      <li><strong>Special Defense:</strong>  ${selected_pokemon["Sp. Def"]}</li>
      <li><strong>Speed:</strong>            ${selected_pokemon["Speed"]}</li>
      <li><strong>Generation:</strong>       ${selected_pokemon["Generation"]}</li>
    </ul>  
  `);
}

// Updates Pokemon 2 stats card
function update_pokemon2_stats(selected_name) {
  const selected_pokemon = pokemon_data.find(pokemon => pokemon.Name === selected_name);
  // console.log('Pokemon 2:', selected_pokemon);
  update_pokemon_image(selected_name, "p2_hero_image")

  const is_legendary = selected_pokemon["Legendary"] === "True";

  d3.select("#p2_stats").html(`
    <h4>${selected_pokemon["Name"]} </h4>
    <h5 class="legendary_label">${is_legendary ? "(Legendary)" : ""}</h5>    
    <ul>
      <li><strong>Type 1:</strong>           ${selected_pokemon["Type 1"]}</li>
      <li><strong>Type 2:</strong>           ${selected_pokemon["Type 2"]}</li>
      <li><strong>HP:</strong>               ${selected_pokemon["HP"]}</li>
      <li><strong>Attack:</strong>           ${selected_pokemon["Attack"]}</li>
      <li><strong>Special Attack:</strong>   ${selected_pokemon["Sp. Atk"]}</li>
      <li><strong>Special Defense:</strong>  ${selected_pokemon["Sp. Def"]}</li>
      <li><strong>Speed:</strong>            ${selected_pokemon["Speed"]}</li>
      <li><strong>Generation:</strong>       ${selected_pokemon["Generation"]}</li>
    </ul>  
  `);
}


// Function to update the picture of the selected Pokémon
function update_pokemon_image(selected_name, container_id) {
  // Construct the URL of the image based on the selected Pokémon's name
  const image_url = `static\\images\\${selected_name.toLowerCase()}.png`;

  console.log(`${container_id}:  ${image_url}`)

  // Update the src attribute of the image element
  d3.select(container_id).attr('src', image_url);
  // document.getElementById(container_id).src(image_url);
}





// Call the function to fetch and populate the dropdown when the page loads
document.addEventListener('DOMContentLoaded', load_pokemon);

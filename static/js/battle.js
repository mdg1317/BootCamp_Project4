// console.log("connected");

// File Paths & variables
const pokemon_csv = "static/data/pokemon.csv";
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

  // Updates p1 vs p2 in center column
  update_p1_v_p2()
}



// Updates Pokemon 1 stats card
function update_pokemon1_stats(selected_name) {
  const selected_pokemon = pokemon_data.find(pokemon => pokemon.Name === selected_name);

  // console.log('Pokemon 1:', selected_pokemon);
  update_pokemon_image(selected_name, "p1_hero_image")

  // Updates p1 vs p2 in center column
  update_p1_v_p2()

  const is_legendary = selected_pokemon["Legendary"] === "True";

  const type1 = `static\\images\\${selected_pokemon["Type 1"].toLowerCase()}.png`;
  const type2 = selected_pokemon["Type 2"]
  ? `static\\images\\${selected_pokemon["Type 2"].toLowerCase()}.png`
  : "static\\images\\none.png";

  d3.select("#p1_stats").html(`
    <h4>${selected_pokemon["Name"]} </h4>
    <h5 class="legendary_label">${is_legendary ? "(Legendary)" : ""}</h5>
    <img class="type_label" src=${type1} title="${selected_pokemon["Type 1"]}"> <img class="type_label" src=${type2} title="${selected_pokemon["Type 2"]}">    
    <ul>    
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
  // Updates p1 vs p2 in center column
  update_p1_v_p2()

  const is_legendary = selected_pokemon["Legendary"] === "True";

  const type1 = `static\\images\\${selected_pokemon["Type 1"].toLowerCase()}.png`;
  const type2 = selected_pokemon["Type 2"]
  ? `static\\images\\${selected_pokemon["Type 2"].toLowerCase()}.png`
  : "static\\images\\none.png";

  d3.select("#p2_stats").html(`
    <h4>${selected_pokemon["Name"]} </h4>
    <h5 class="legendary_label">${is_legendary ? "(Legendary)" : ""}</h5>
    <img class="type_label" src=${type1} title="${selected_pokemon["Type 1"]}"> <img class="type_label" src=${type2} title="${selected_pokemon["Type 2"]}">   
    <ul>    
      <li><strong>HP:</strong>               ${selected_pokemon["HP"]}</li>
      <li><strong>Attack:</strong>           ${selected_pokemon["Attack"]}</li>
      <li><strong>Special Attack:</strong>   ${selected_pokemon["Sp. Atk"]}</li>
      <li><strong>Special Defense:</strong>  ${selected_pokemon["Sp. Def"]}</li>
      <li><strong>Speed:</strong>            ${selected_pokemon["Speed"]}</li>
      <li><strong>Generation:</strong>       ${selected_pokemon["Generation"]}</li>
    </ul>  
  `);
}


// Updates the selected Pokémon picture
function update_pokemon_image(selected_name, container_id) {
  const image_url = `static\\images\\${selected_name.toLowerCase()}.png`;
  const hero = document.getElementById(container_id)
  hero.src = image_url
};


// Updates center column when pulldown options change
function update_p1_v_p2() {
  const p1_pokemon = d3.select('#pokemon1_dropdown').property('value');
  const p2_pokemon = d3.select('#pokemon2_dropdown').property('value');

  // html output
  d3.select("#pokemon_lineup").html(`
  <p class="predict_player">${p1_pokemon}</p> 
  <p class="predict_vs">vs.</p>
  <p class="predict_player">${p2_pokemon}</p>`)

  d3.select("#predicted_result").html(`<img class="placeholder_img" src="../../static/images/pokeomon_battle_predictor.png" />`);
}



// Predict Winner Button
function predict_winner() {
  const p1_pokemon = d3.select('#pokemon1_dropdown').property('value');
  const p2_pokemon = d3.select('#pokemon2_dropdown').property('value');


  fetch('/predict_winner', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ player1: p1_pokemon, player2: p2_pokemon })
  })
  .then(response => {
    if (response.ok) {
      return response.json(); // Process the JSON response
    } else {
      console.error("Error connecting to Flask app");
    }
  })
  .then(data => {
    post_prediction(data.result)
  })
  .catch(error => console.error("Error:", error));
}


// Add event listener to the Predict Winner button
document.querySelector('.btn.btn-primary').addEventListener('click', predict_winner);


// Posts prediction based on what is returned by python/flask
function post_prediction(prediction){
  const image_url = `static\\images\\${prediction.toLowerCase()}.png`;
  
  // html outputs
  d3.select("#predicted_result").html(`
  <h3 class="predicted_result_title">Predicted Winner:</h3>
  <hr />
  <img class="hero_image" src=${image_url} />
  <h4 class="prediction_result">${prediction}</h4>  `);
}


// Call the function to fetch and populate the dropdown when the page loads
document.addEventListener('DOMContentLoaded', load_pokemon);

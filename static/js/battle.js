// console.log("connected");

// File Paths & variables
let pokemon_csv = "static/data/pokemon_etl.csv";
let pokemon_data = [];
let pokemon_names = [];
let selected_name = "";
let index_p1 = 0;
let index_p2 = 0;

// Get the necessary elements
const dropdown_p1 = d3.select('#pokemon1_dropdown');
const dropdown_p2 = d3.select('#pokemon2_dropdown');
const previous_p1 = d3.select("#previous_p1");
const previous_p2 = d3.select("#previous_p2");
const next_p1 = d3.select("#next_p1");
const next_p2 = d3.select("#next_p2");

// Parse the CSV
function load_pokemon() {
  d3.csv(pokemon_csv).then(data => {
    pokemon_data = data;

    // Sort the names alphabetically and add them to dropdowns
    pokemon_names = data.map(row => row.Name).sort();
    populate_dropdowns(pokemon_names);

    // Change the displayed Pokemon when the dropdown value changes
    dropdown_p1.on('change', function() {
      selected_name = dropdown_p1.property('value');
      index_p1 = dropdown_p1.property("selectedIndex");
      update_pokemon1_stats(selected_name);
    });
    dropdown_p2.on('change', function() {
      selected_name = dropdown_p2.property('value');
      index_p2 = dropdown_p2.property("selectedIndex");
      update_pokemon2_stats(selected_name);
    });

    // Go to the next/previous Pokemon when the appropriate buttons are clicked
    previous_p1.on("click", function() {
      change_pokemon(previous_p1, index_p1, dropdown_p1);
    });

    next_p1.on("click", function() {
      change_pokemon(next_p1, index_p1, dropdown_p1);
    });

    previous_p2.on("click", function() {
      change_pokemon(previous_p2, index_p2, dropdown_p2);
    });

    next_p2.on("click", function() {
      change_pokemon(next_p2, index_p2, dropdown_p2);
    });
    
  }).catch(error => console.error('Error fetching the CSV file:', error));
}

// Populate dropdowns
function populate_dropdowns(pokemon_names) {
  // Appends the names to the dropdowns
  dropdown_p1.selectAll('option')
    .data(pokemon_names)
    .enter()
    .append('option')
    .text(d => d)
    .attr('value', d => d);

  dropdown_p2.selectAll('option')
    .data(pokemon_names)
    .enter()
    .append('option')
    .text(d => d)
    .attr('value', d => d);

  // Set the first option as selected
  if (pokemon_names.length > 0) {
    dropdown_p1.property('selectedIndex', 0);
    dropdown_p2.property('selectedIndex', 0);
  }

  // Update all columns
  update_pokemon1_stats(pokemon_names[0]);
  update_pokemon2_stats(pokemon_names[0]);
  update_p1_v_p2()
}

function change_pokemon(button, index, dropdown){
  // Appropriately set the index based on which button pressed
  if (button == previous_p1 || button == previous_p2) {
    if ((index - 1) < 0) {
      index = pokemon_names.length - 1;
    } else {
      index--;
    }
    if (button == previous_p1) {
      index_p1 = index;
    } else {
      index_p2 = index;
    }
  } else {
    if ((index + 1) == pokemon_names.length) {
      index = 0;
    } else {
      index++;
    }
    if (button == next_p1) {
      index_p1 = index;
    } else {
      index_p2 = index;
    }
  }
  
  // Set the dropdown value
  selected_name = pokemon_names[index];
  dropdown.property("value", selected_name);

  // Update the appropriate column
  if (button == previous_p1 || button == next_p1) {
    update_pokemon1_stats(selected_name);
  } else {
    update_pokemon2_stats(selected_name);
  }
}


// Updates Pokemon 1 stats card
function update_pokemon1_stats(selected_name) {
  const selected_pokemon = pokemon_data.find(pokemon => pokemon.Name === selected_name);

  update_pokemon_image(selected_name, "p1_hero_image")

  // Updates p1 vs p2 in center column
  update_p1_v_p2()

  const is_legendary = selected_pokemon["Legendary"] == 1;
  const is_mythical = selected_pokemon["Mythical"] == 1;

  const type1 = `static\\images\\${selected_pokemon["Type 1"].toLowerCase()}.png`;
  const type2 = selected_pokemon["Type 2"]
  ? `static\\images\\${selected_pokemon["Type 2"].toLowerCase()}.png`
  : "static\\images\\none.png";

  d3.select("#p1_stats").html(`
    <h4>${selected_pokemon["Name"]} </h4>
    <h5 class="legendary_label">${is_legendary ? "(Legendary)" : "" || is_mythical ? "(Mythical)" : "" }</h5>
    <img class="type_label" src=${type1} title="${selected_pokemon["Type 1"]}"> <img class="type_label" src=${type2} title="${selected_pokemon["Type 2"]}">    
    <ul>    
      <li><strong>HP:</strong>               ${selected_pokemon["HP"]}</li>
      <li><strong>Attack:</strong>           ${selected_pokemon["Attack"]}</li>
      <li><strong>Defense:</strong>           ${selected_pokemon["Defense"]}</li>
      <li><strong>Sp. Attack:</strong>   ${selected_pokemon["Sp. Atk"]}</li>
      <li><strong>Sp. Defense:</strong>  ${selected_pokemon["Sp. Def"]}</li>
      <li><strong>Speed:</strong>            ${selected_pokemon["Speed"]}</li>
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

  const is_legendary = selected_pokemon["Legendary"] == 1;
  const is_mythical = selected_pokemon["Mythical"] == 1;
  
  const type1 = `static\\images\\${selected_pokemon["Type 1"].toLowerCase()}.png`;
  const type2 = selected_pokemon["Type 2"]
  ? `static\\images\\${selected_pokemon["Type 2"].toLowerCase()}.png`
  : "static\\images\\none.png";

  d3.select("#p2_stats").html(`
    <h4>${selected_pokemon["Name"]} </h4>
    <h5 class="legendary_label">${is_legendary ? "(Legendary)" : "" || is_mythical ? "(Mythical)" : "" }</h5>
    <img class="type_label" src=${type1} title="${selected_pokemon["Type 1"]}"> <img class="type_label" src=${type2} title="${selected_pokemon["Type 2"]}">   
    <ul>    
      <li><strong>HP:</strong>               ${selected_pokemon["HP"]}</li>
      <li><strong>Attack:</strong>           ${selected_pokemon["Attack"]}</li>
      <li><strong>Defense:</strong>           ${selected_pokemon["Defense"]}</li>
      <li><strong>Sp. Attack:</strong>   ${selected_pokemon["Sp. Atk"]}</li>
      <li><strong>Sp. Defense:</strong>  ${selected_pokemon["Sp. Def"]}</li>
      <li><strong>Speed:</strong>            ${selected_pokemon["Speed"]}</li>
    </ul>  
  `);
}


// Updates the selected Pokémon picture
function update_pokemon_image(selected_name, container_id) {
  const image_url = `static\\images\\${selected_name.replace(" ", "_").replace(".", "").toLowerCase()}.png`;
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

from flask import Flask, request, render_template, jsonify
import pandas as pd
import joblib
from sklearn.preprocessing import StandardScaler
from model import X_scaler

app = Flask(__name__)

loaded_model = joblib.load("final_rf_model.joblib")
pokemon_df = pd.read_csv("static/data/pokemon_etl.csv")
pokemon_df.fillna("None", inplace=True)


# Launches website index.html
@app.route('/')
def index():
    return render_template('index.html')


# App/path for predicting the winner
@app.route('/predict_winner', methods=['POST'])
def predict_winner():
    data = request.get_json()  # Extract JSON data from the request
    p1_pokemon = data.get('player1')
    p2_pokemon = data.get('player2')
    
    # Calls process_battle function to feed the data to the model so it can return the prediction.
    winner = process_battle(p1_pokemon, p2_pokemon)
    
    return jsonify({'result': winner})  # Return the result as JSON back to battle.js


# Uses model to predict the winner
def process_battle(p1_pokemon, p2_pokemon): 
    # Get stats of selected Pokemon
    p1_stats = pokemon_df.loc[pokemon_df["Name"] == p1_pokemon]
    p2_stats = pokemon_df.loc[pokemon_df["Name"] == p2_pokemon]
    
    # Put data into one-row DataFrame formatted as necessary
    X_test = pd.DataFrame(data={"first_hp": p1_stats["HP"].values, "first_attack": p1_stats["Attack"].values,
                                    "first_sp_atk": p1_stats["Sp. Atk"].values, "first_sp_def": p1_stats["Sp. Def"].values, "first_speed": p1_stats["Speed"].values,
                                    "second_hp": p2_stats["HP"].values, "second_attack": p2_stats["Attack"].values,
                                    "second_sp_atk": p2_stats["Sp. Atk"].values, "second_speed": p2_stats["Speed"].values})
    
    # Scale the data and make prediction
    X_test_scaled = X_scaler.transform(X_test)
    prediction = loaded_model.predict(X_test_scaled)[0]

    # Return name of winner
    if prediction == 0:
        battle_prediction = p1_stats["Name"].values[0]
    else:
        battle_prediction = p2_stats["Name"].values[0]

    return battle_prediction

def get_type_effectiveness(first_type_1, first_type_2, second_type_1, second_type_2):
    # Create corresponding type list and matrix of type matchups
    types = ["Normal", "Fire", "Water", "Electric", "Grass", "Ice", "Fighting", "Poison",
            "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy"]
    type_chart = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.5, 0, 1, 1, 0.5, 1],
                [1, 0.5, 0.5, 1, 2, 2, 1, 1, 1, 1, 1, 2, 0.5, 1, 0.5, 1, 2, 1],
                [1, 2, 0.5, 1, 0.5, 1, 1, 1, 2, 1, 1, 1, 2, 1, 0.5, 1, 1, 1],
                [1, 1, 2, 0.5, 0.5, 1, 1, 1, 0, 2, 1, 1, 1, 1, 0.5, 1, 1, 1],
                [1, 0.5, 2, 1, 0.5, 1, 1, 0.5, 2, 0.5, 1, 0.5, 2, 1, 0.5, 1, 0.5, 1],
                [1, 0.5, 0.5, 1, 2, 0.5, 1, 1, 2, 2, 1, 1, 1, 1, 2, 1, 0.5, 1],
                [2, 1, 1, 1, 1, 2, 1, 0.5, 1, 0.5, 0.5, 0.5, 2, 0, 1, 2, 2, 0.5],
                [1, 1, 1, 1, 2, 1, 1, 0.5, 0.5, 1, 1, 1, 0.5, 0.5, 1, 1, 0, 2],
                [1, 2, 1, 2, 0.5, 1, 1, 2, 1, 0, 1, 0.5, 2, 1, 1, 1, 2, 1],
                [1, 1, 1, 0.5, 2, 1, 2, 1, 1, 1, 1, 2, 0.5, 1, 1, 1, 0.5, 1],
                [1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 0.5, 1, 1, 1, 1, 0, 0.5, 1],
                [1, 0.5, 1, 1, 2, 1, 0.5, 0.5, 1, 0.5, 2, 1, 1, 0.5, 1, 2, 0.5, 0.5],
                [1, 2, 1, 1, 1, 2, 0.5, 1, 0.5, 2, 1, 2, 1, 1, 1, 1, 0.5, 1],
                [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 0.5, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 0.5, 0],
                [1, 1, 1, 1, 1, 1, 0.5, 1, 1, 1, 2, 1, 1, 2, 1, 0.5, 1, 0.5],
                [1, 0.5, 0.5, 0.5, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 0.5, 2],
                [1, 0.5, 1, 1, 1, 1, 2, 0.5, 1, 1, 1, 1, 1, 1, 2, 2, 0.5, 1]]

    # Create new columns to show overall "effectiveness" against opponent Pokemon
    first_effectiveness = 0.0
    second_effectiveness = 0.0

    # For each matchup, get each Pokemon types and sum their effectiveness
    # The higher the number, the more "effective" that Pokemon is against its opponent
    if first_type_2 == "None":
        first_types = [first_type_1]
    else:
        first_types = [first_type_1, first_type_2]

    if second_type_2 == "None":
        second_types = [second_type_1]
    else:
        second_types = [second_type_1, second_type_2]

    for first_type in first_types:
        for second_type in second_types:
            first = type_chart[types.index(first_type)][types.index(second_type)]
            second = type_chart[types.index(second_type)][types.index(first_type)]

            if not first == 0:
                first_effectiveness = first_effectiveness * first

            if not second == 0:
                second_effectiveness = second_effectiveness * second

            #pokemon_combats_df.loc[index, "first_effectiveness"] += first_effectiveness
            #pokemon_combats_df.loc[index, "second_effectiveness"] += second_effectiveness

    return [first_effectiveness, second_effectiveness]

if __name__ == '__main__':
    app.run(debug=True)

from flask import Flask, request, render_template, jsonify

app = Flask(__name__)

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
    print(f"{p1_pokemon} vs {p2_pokemon}")




    battle_prediction = "Abomasnow"  #change this to return the name of the pokemon winner
    return battle_prediction

if __name__ == '__main__':
    app.run(debug=True)

from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import pandas as pd

pokemon_combats_df = pd.read_csv("Resources/pokemon_combats_etl.csv")

# Split our preprocessed data into our features and target arrays
X = pokemon_combats_df.drop(["first_effectiveness", "first_defense", "first_mythical", "first_legendary",
                             "second_effectiveness", "second_defense", "second_sp_def", "second_mythical",
                             "second_legendary", "winner"], axis=1)
#X = pokemon_combats_df.drop("winner", axis=1)
y = pokemon_combats_df["winner"]

# Split the preprocessed data into a training and testing dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=78)

# Create a StandardScaler instances
scaler = StandardScaler()

# Fit the StandardScaler
X_scaler = scaler.fit(X_train)

# Scale the data
X_train_scaled = X_scaler.transform(X_train)
X_test_scaled = X_scaler.transform(X_test)
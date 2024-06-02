# Pokémon Battle Predictor
*Machine Learning and Predictive Modeling - Group Project*

![Pokémon Battle Predictor](static/images/project_banner.jpg)

## Background
Quick introduction

## Pokémon Trainers
- **[Travis Cook](https://github.com/byTravis)**
    - stuff we did
- **[Matthew Groh](https://github.com/mdg1317)**
    - stuff we did
- **[Marshal Rittenger](https://github.com/Ray-Marshal)**
    - stuff we did

## Approach
(Matthew ETL, etc.)
    For our classification models, we decided to focus on two types that work well for binary classification: Sequential Neural Networks and Random Forest Models. Our first attempts at both were very successful; both baseline models were around 94% accurate. However, we knew with some optimization techniques we could hopefully make some improvements. For the random forest model, we decided to take a closer look at which features were the most important. After doing this, it was clear that there were some that could feasibly be removed with no diminishing of the results (or perhaps even an improvement). There was a small but noticeable improvement after doing this, so we decided to try taking away even more features and ran the model again. This resulted in about the same accuracy, so we kept those features for the following test. We then found some optimization functions in scikit-learn that could help us refine the model even further: RandomizedSearchCV and GridSearchCV. Both allow you to set certain hyperparemeters of each model and test different combinations of said hyperparameters. Randomized search allows you to set the number of different iterations for it to attempt, while GridSearch allows you to test all of the combinations you give it. We ran these functions with our Random Forest and our Neural Network models. After all of that, in the time we had for this project, we could not find optimizations that made a significant improvement to our models. We are happy that the Pokémon data that we did find was so successful in making the battle predictions, but if we had more time it would have been interesting to find more models and optimization methods to create even better predictions.

## Attribution
- [Pokemon Dataset with Team Combat](https://www.kaggle.com/datasets/tuannguyenvananh/pokemon-dataset-with-team-combat)
- Pokémon names and images sourced from [The Pokémon Company](https://www.pokemon.com/us).  Used for educational purposes only.
- Optimization code and instruction. [Towards Data Science: Hyperparameter Tuning the Random Forest in Python](https://towardsdatascience.com/hyperparameter-tuning-the-random-forest-in-python-using-scikit-learn-28d2aa77dd74)

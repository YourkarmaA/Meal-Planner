
  // Function to calculate BMR based on user's inputs
  function calculateBMR(weight, height, age, gender) {
    let bmr = 0;

    if (gender === 'male') {
      bmr = 66.47 + (13.75 * weight) + (5.003 * height) - (6.755 * age);
    } else if (gender === 'female') {
      bmr = 655.1 + (9.563 * weight) + (1.850 * height) - (4.676 * age);
    }

    return bmr;
  }

  // Function to calculate daily calorie requirement based on BMR and activity level
  function calculateDailyCalorieRequirement(bmr, activityLevel) {
    let dailyCalorieRequirement = 0;

    switch (activityLevel) {
      case 'light':
        dailyCalorieRequirement = bmr * 1.375;
        break;
      case 'moderate':
        dailyCalorieRequirement = bmr * 1.55;
        break;
      case 'active':
        dailyCalorieRequirement = bmr * 1.725;
        break;
      default:
        dailyCalorieRequirement = bmr;
    }

    return dailyCalorieRequirement;
  }

  // Function to handle form submission

  function handleSubmit(event) {
    event.preventDefault();

    // Get user inputs from the form
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const activityLevel = document.getElementById('activity').value;

    // Calculate BMR
    const bmr = calculateBMR(weight, height, age, gender);

    // Calculate daily calorie requirement
    const dailyCalorieRequirement = calculateDailyCalorieRequirement(bmr, activityLevel);

    // Display the result
    alert('Your daily calorie requirement is: ' + dailyCalorieRequirement);
  }

  // Add event listener to the form's submit button
  const form = document.getElementById('user-form');
  form.addEventListener('submit', handleSubmit);



  function generateMealPlan(dailyCalorieRequirement) {
    const apiUrl = 'https://content.newtonschool.co/v1/pr/64995a40e889f331d43f70ae/categories';

    // Make HTTP request to the API
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        // Extract meal plan data based on calorie categories
        const mealPlanData = data.find(category => {
          const minCalories = dailyCalorieRequirement - 500;
          const maxCalories = dailyCalorieRequirement + 500;
          return category.calories.min <= minCalories && category.calories.max >= maxCalories;
        });

        if (mealPlanData) {
          // Display the meal plan
          const mealPlanSection = document.getElementById('meal-plan');
          mealPlanSection.innerHTML = `
            <h2>Meal Plan</h2>
            <div class="meal-card">
              <img src="${mealPlanData.breakfast.image}" alt="${mealPlanData.breakfast.name}">
              <h3>${mealPlanData.breakfast.name}</h3>
              <p>Calories: ${mealPlanData.breakfast.calories}</p>
              <button class="get-recipe" data-meal-id="${mealPlanData.breakfast.id}">Get Recipe</button>
            </div>
            <div class="meal-card">
              <img src="${mealPlanData.lunch.image}" alt="${mealPlanData.lunch.name}">
              <h3>${mealPlanData.lunch.name}</h3>
              <p>Calories: ${mealPlanData.lunch.calories}</p>
              <button class="get-recipe" data-meal-id="${mealPlanData.lunch.id}">Get Recipe</button>
            </div>
            <div class="meal-card">
              <img src="${mealPlanData.dinner.image}" alt="${mealPlanData.dinner.name}">
              <h3>${mealPlanData.dinner.name}</h3>
              <p>Calories: ${mealPlanData.dinner.calories}</p>
              <button class="get-recipe" data-meal-id="${mealPlanData.dinner.id}">Get Recipe</button>
            </div>
          `;
        } else {
          // Handle case when no meal plan is available for the given calorie requirement
          console.log('No meal plan available for the given calorie requirement.');
        }
      })
      .catch(error => {
        console.log('Error fetching meal plan:', error);
      });
  }


  // Function to fetch and display recipe based on meal ID
  function fetchRecipe(mealId) {
    const apiUrl = `https://content.newtonschool.co/v1/pr/64996337e889f331d43f70ba/recipes/${mealId}`;

    // Make HTTP request to the API
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        // Extract recipe data
        const ingredients = data.ingredients.split(',');
        const steps = data.steps.split('.');

        // Display the recipe
        const recipeSection = document.getElementById('recipe-section');
        recipeSection.innerHTML = `
          <h2>Recipe</h2>
          <div class="recipe-tabs">
            <button class="tab-btn active" data-tab="ingredients">Ingredients</button>
            <button class="tab-btn" data-tab="steps">Steps</button>
          </div>
          <div class="tab-content">
            <div id="ingredients" class="tab-panel active">
              <ul>
                ${ingredients.map(ingredient => `<li>${ingredient.trim()}</li>`).join('')}
              </ul>
            </div>
            <div id="steps" class="tab-panel">
              <ol>
                ${steps.map(step => `<li>${step.trim()}</li>`).join('')}
              </ol>
            </div>
          </div>
        `;
      })
      .catch(error => {
        console.log('Error fetching recipe:', error);
      });
  }


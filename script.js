const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailContent = document.querySelector('.recipe-detail-content');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');

// Function to Fetch Recipes 
const fetchRecipes = async (query) =>{
    recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>";
    try {
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const response = await data.json();

        recipeContainer.innerHTML = "";
        response.meals.forEach(meal=>{
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe');
        recipeDiv.innerHTML = `
            <img src="${meal.strMealThumb}">
            <h3>${meal.strMeal}</h3>
            <p><span>${meal.strArea}</span> Dish</p>
            <p>Belongs to <span>${meal.strCategory}</span> Category</p>
        `
        const button = document.createElement('button');
        button.textContent = "Get Recipe";
        recipeDiv.appendChild(button);

        // Adding Event Listener to Recipe Button
        button.addEventListener('click', () => {
            openRecipePopup(meal);
        })
        recipeContainer.appendChild(recipeDiv);
        });
    } catch (error) {
        recipeContainer.innerHTML = "<h2>Error in Fetching Recipes...</h2>";
    }
};


// Function to Fetch ingredients and measurement
const fetchIngredients = (meal) => {
    let ingredientsList = "";
    for (let i=1 ; i<=20 ; i++){
        const ingredient = meal[`strIngredient${i}`];
        if(ingredient){
            const measure = meal[`strMeasure${i}`];
            ingredientsList += `<li>${measure} - ${ingredient}</li>`;
        }
        else {
            break;
        }
    }
    return ingredientsList;
}

const openRecipePopup = (meal) =>{
    recipeDetailContent.innerHTML = `
        <h2 class="recipeName">${meal.strMeal}</h2>
        <h3>Ingredients :</h3>
        <ul class="ingredientList">${fetchIngredients(meal)}</ul>
        <div  class="recipeInstructions">
            <h3>Instuctions :</h3>
            <p>${meal.strInstructions}</p>
        </div>
    `
    
    recipeDetailContent.parentElement.style.display = "block";
}

recipeCloseBtn.addEventListener('click' , () => {
    recipeDetailContent.parentElement.style.display = "none";
})

searchBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if(!searchInput){
        recipeContainer.innerHTML = `<h2>Type the Meal in the search box.</h2>`;
        return;
    }
    fetchRecipes(searchInput);
});
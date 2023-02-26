let favorites = JSON.parse(localStorage.getItem('favorites')) || {};
let initialMeals = [];
let timeOutId = null;

// Elements

const searchInput = document.getElementById('search-input');
const mealsList = document.getElementById('meal-list');
const mealSection = document.getElementById('meal-section');
const mealHeaderSection = document.getElementById('meal-header-section');
const searchForm = document.getElementById('search-form');

// Event listeners

searchInput.addEventListener('input', (e) => {
    const searchText = e.target.value?.trim();
    // Adding delay to reduce multiple request
    clearTimeout(timeOutId);
    timeOutId = setTimeout(() => performSearch(searchText), 250);
});

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchText = searchInput.value?.trim();
    performSearch(searchText);
})

searchInput.addEventListener('load', () => {
    performSearch(searchInput.value || 'a');
});

// For initial we will search
performSearch(' ');

// Fetch meals from "themealdb" 
async function performSearch(searchText) {
    try {
        if (searchText) {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchText}`);
            const responseJson = await response.json();
            const meals = responseJson.meals;

            if (initialMeals.length == 0) {
                initialMeals = meals;
            }

            updateMeals(meals, searchText);
        } else {
            updateMeals(initialMeals);
        }
    } catch (err) {
        console.error(err);
    }
}

// Show empty placeholder if there is no result found
function showEmptyPlaceholder(searchText) {
    mealsList.innerHTML = `No Result Found for ${searchText}`;
}

// Updated the meal section html
function updateMeals(meals, searchText) {
    if (meals == null || meals.length == 0) {
        return showEmptyPlaceholder(searchText);
    }

    mealsList.innerHTML = '';

    for (let meal of meals) {
        const mealLink = document.createElement('a');
        mealLink.setAttribute('id', meal.idMeal);
        mealLink.setAttribute('class', 'meal-link');
        mealLink.setAttribute('href', `./meal-details.html?id=${meal.idMeal}&title=${meal.strMeal}`);

        const mealContainer = document.createElement('div');
        mealContainer.setAttribute('class', 'meal-container');

        const mealHeader = document.createElement('div');
        mealHeader.setAttribute('class', 'meal-header');

        const mealImage = document.createElement('img');
        mealImage.setAttribute('src', meal.strMealThumb);
        mealImage.setAttribute('class', 'meal-image');

        mealHeader.append(mealImage);

        const isFavorite = favorites.hasOwnProperty(meal.idMeal);

        const favIcon = isFavorite ? '<i class="fa-sharp fa-solid fa-heart"></i>' : '<i class="fa-regular fa-heart"></i>';

        const favButton = document.createElement('button');
        favButton.dataset.id = meal.idMeal;
        favButton.setAttribute('class', `meal-favourite-btn ${isFavorite ? 'fav' : ''}`);
        favButton.innerHTML = favIcon;
        favButton.addEventListener('click', (e) => onTapFavourite(e, meal));

        mealHeader.append(favButton);

        const mealContent = document.createElement('div');
        mealContent.setAttribute('class', 'meal-content');

        const mealTitle = document.createElement('p');
        mealTitle.setAttribute('class', 'meal-title');
        mealTitle.innerText = meal.strMeal;

        const mealCategory = document.createElement('p');
        mealCategory.setAttribute('class', 'meal-category');
        mealCategory.innerText = meal.strCategory?.trim() || '';

        const mealArea = document.createElement('p');
        mealArea.setAttribute('class', 'meal-area');
        mealArea.innerText = meal.strArea?.trim() || '';

        mealContent.append(mealTitle, mealCategory, mealArea);
        mealContainer.append(mealHeader, mealContent);
        mealLink.appendChild(mealContainer);

        mealsList.appendChild(mealLink);
    }
}

// Check and remove / add to favorites
function onTapFavourite(e, meal) {
    const isFavorite = favorites.hasOwnProperty(meal.idMeal);

    isFavorite ? removeFavorite(e, meal) : addFavorite(e, meal);
}

// Add favorites to the local storage
function addFavorite(e, meal) {
    e.preventDefault();

    const favButton = document.querySelector(`.meal-favourite-btn[data-id="${meal.idMeal}"]`);
    const favIcon = '<i class="fa-sharp fa-solid fa-heart"></i>';

    favButton.classList.add('fav');
    favButton.innerHTML = favIcon;

    favorites[meal.idMeal] = meal;

    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Remove favorites to the local storage
function removeFavorite(e, meal) {
    e.preventDefault();

    const favButton = document.querySelector(`.meal-favourite-btn[data-id="${meal.idMeal}"]`);
    const favIcon = '<i class="fa-regular fa-heart"></i>';

    favButton.classList.remove('fav');
    favButton.innerHTML = favIcon;

    delete favorites[meal.idMeal];

    localStorage.setItem('favorites', JSON.stringify(favorites));
}

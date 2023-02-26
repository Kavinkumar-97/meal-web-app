// Fetching favourites from local storage
let favorites = JSON.parse(localStorage.getItem('favorites')) || {};

//  Elements
const mealsList = document.getElementById('meal-list');

// Updates meals in document
updateMeals(Object.values(favorites));

// Shows empty placeholder
function showEmptyPlaceholder() {
    mealsList.innerHTML = `No Meals Are Added To Favourites`;
}

// Update meal in document
function updateMeals(meals) {
    if (meals == null || meals.length == 0) {
        return showEmptyPlaceholder();
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

        const favIcon = '<i class="fa-sharp fa-solid fa-heart"></i>';

        const favButton = document.createElement('button');
        favButton.dataset.id = meal.idMeal;
        favButton.setAttribute('class', `meal-favourite-btn fav`);
        favButton.innerHTML = favIcon;
        favButton.addEventListener('click', (e) => onRemoveFavourite(e, meal));

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

// Remove the meal from favourites
function onRemoveFavourite(e, meal) {
    e.preventDefault();
    const mealLink = document.getElementById(meal.idMeal);
    mealLink.parentNode.removeChild(mealLink);
    delete favorites[meal.idMeal];
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateMeals(Object.values(favorites));
}
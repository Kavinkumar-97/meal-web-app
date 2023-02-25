const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const title = params.get("title");

document.title = title;

const mealDetailSection = document.getElementById('meal-details-section');

let mealDetail = null;

fetchDetail(id);

async function fetchDetail(id) {
    try {
        console.log(id);
        if (id) {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
            const responseJson = await response.json();
            const meal = responseJson.meals[0];
            console.log(meal);

            mealDetail = meal;
            updateMealDetail(mealDetail);
        }
    } catch (err) {
        console.error(err);
    }
}

function updateMealDetail(mealDetail) {

    console.log()

    const mealImage = document.createElement('img');
    mealImage.setAttribute('id', 'meal-image');
    mealImage.setAttribute('src', mealDetail.strMealThumb);

    const mealContent = document.createElement('div');
    mealContent.setAttribute('id', 'meal-content');

    const mealTitle = document.createElement('h1');
    mealTitle.setAttribute('id', 'meal-title');
    mealTitle.innerText = mealDetail.strMeal;

    const mealCategory = document.createElement('p');
    mealCategory.setAttribute('id', 'meal-category');
    mealCategory.innerText = mealDetail.strArea + ' - ' + mealDetail.strCategory;

    const mealInstructionTitle = document.createElement('h4');
    mealInstructionTitle.setAttribute('id', 'meal-instruction-title');
    mealInstructionTitle.setAttribute('class', 'heading');

    const mealInstructionList = document.createElement('div');
    mealInstructionList.setAttribute('id', 'meal-instruction-list');
    mealInstructionTitle.innerText = 'Instructions';

    const instructions = mealDetail.strInstructions.split('\r\n').filter(ins => ins.length > 0 && !ins.toLowerCase().includes('step'));

    instructions.forEach((instruction, index) => {
        const instructionListItem = document.createElement('div');
        instructionListItem.setAttribute('class', 'meal-instruction');

        const instructionStep = document.createElement('p');
        instructionStep.setAttribute('class', 'instruction-step');
        instructionStep.innerText = `STEP ${index + 1}:`;

        const instructionContent = document.createElement('p');
        instructionContent.setAttribute('class', 'instruction-content');

        const isImportant = instruction[0] == '*';
        if (isImportant) {
            instructionContent.setAttribute('class', 'imp');
        }

        instructionContent.innerText = `${instruction}`;

        instructionListItem.append(instructionStep, instructionContent);
        mealInstructionList.appendChild(instructionListItem);
    });

    const mealIngredientTitle = document.createElement('h4');
    mealIngredientTitle.setAttribute('id', 'meal-ingredient-title');
    mealIngredientTitle.setAttribute('class', 'heading');
    mealIngredientTitle.innerText = 'Ingredients';

    const mealIngredient = document.createElement('table');
    mealIngredient.setAttribute('class', 'ingredients-table');

    let count = 1;
    let ingredient = mealDetail[`strIngredient${count}`];
    let measurment = mealDetail[`strMeasure${count}`];
    while (ingredient?.length > 0 && measurment?.length > 0) {

        const row = document.createElement('tr');
        row.setAttribute('class', 'ingredient-row');

        const ingredientNode = document.createElement('td');
        ingredientNode.setAttribute('class', 'ingredient');
        ingredientNode.innerText = ingredient;

        const measurementNode = document.createElement('td');
        measurementNode.setAttribute('class', 'measurement');
        measurementNode.innerText = measurment;

        row.append(ingredientNode, measurementNode);
        mealIngredient.append(row);

        count += 1;
        ingredient = mealDetail[`strIngredient${count}`];
        measurment = mealDetail[`strMeasure${count}`];
    }

    const mealSource = document.createElement('h4');
    mealSource.setAttribute('class', 'heading');
    mealSource.innerText = 'Source';

    const sourceLink = document.createElement('a');
    sourceLink.setAttribute('href', mealDetail.strYoutube);
    sourceLink.innerText = mealDetail.strYoutube;

    mealDetailSection.innerHTML = '';

    mealContent.append(mealTitle, mealCategory, mealInstructionTitle, mealInstructionList, mealIngredientTitle, mealIngredient, mealSource, sourceLink);

    mealDetailSection.append(mealImage, mealContent);
}
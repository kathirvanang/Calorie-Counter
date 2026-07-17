const calorieCounter = document.getElementById("calorie-counter");
const budgetNumberInput = document.getElementById("budget");
const entryDropdown = document.getElementById("entry-dropdown");
const addEntryButton = document.getElementById("add-entry");
const clearButton = document.getElementById("clear");
const output = document.getElementById("output");

let isError = false;

function cleanInputString(str) {
  return str.replace(/[+\-\s]/g, "");
}

function isInvalidInput(str) {
  return /\d+e\d+/i.test(str);
}

function addEntry() {
  const targetInputContainer = document.querySelector(
    `#${entryDropdown.value} .input-container`
  );

  const entryNumber =
    targetInputContainer.querySelectorAll('input[type="text"]').length + 1;

  const htmlString = `
    <label for="${entryDropdown.value}-${entryNumber}-name">
      Entry ${entryNumber} Name
    </label>
    <input
      type="text"
      id="${entryDropdown.value}-${entryNumber}-name"
      placeholder="Name"
    />

    <label for="${entryDropdown.value}-${entryNumber}-calories">
      Entry ${entryNumber} Calories
    </label>
    <input
      type="number"
      min="0"
      id="${entryDropdown.value}-${entryNumber}-calories"
      placeholder="Calories"
    />
  `;

  targetInputContainer.insertAdjacentHTML("beforeend", htmlString);
}

function getCaloriesFromInputs(list) {
  let calories = 0;

  for (const item of list) {
    const currVal = cleanInputString(item.value);

    if (isInvalidInput(currVal)) {
      alert(`Invalid Input: ${currVal}`);
      isError = true;
      return 0;
    }

    calories += Number(currVal);
  }

  return calories;
}

function calculateCalories(e) {
  e.preventDefault();
  isError = false;

  const breakfastCalories = getCaloriesFromInputs(
    document.querySelectorAll("#breakfast input[type='number']")
  );

  const lunchCalories = getCaloriesFromInputs(
    document.querySelectorAll("#lunch input[type='number']")
  );

  const dinnerCalories = getCaloriesFromInputs(
    document.querySelectorAll("#dinner input[type='number']")
  );

  const snacksCalories = getCaloriesFromInputs(
    document.querySelectorAll("#snacks input[type='number']")
  );

  const exerciseCalories = getCaloriesFromInputs(
    document.querySelectorAll("#exercise input[type='number']")
  );

  const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);

  if (isError) return;

  const consumedCalories =
    breakfastCalories +
    lunchCalories +
    dinnerCalories +
    snacksCalories;

  const remainingCalories =
    budgetCalories - consumedCalories + exerciseCalories;

  const surplusOrDeficit =
    remainingCalories < 0 ? "Surplus" : "Deficit";

  output.innerHTML = `
    <span class="${surplusOrDeficit.toLowerCase()}">
      ${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}
    </span>
    <hr>
    <p>${budgetCalories} Calories Budgeted</p>
    <p>${consumedCalories} Calories Consumed</p>
    <p>${exerciseCalories} Calories Burned</p>
  `;

  output.classList.remove("hide");
}

function clearForm() {
  document.querySelectorAll(".input-container").forEach((container) => {
    container.innerHTML = "";
  });

  budgetNumberInput.value = "";
  output.innerHTML = "";
  output.classList.add("hide");
}

if (addEntryButton) {
  addEntryButton.addEventListener("click", addEntry);
}

if (calorieCounter) {
  calorieCounter.addEventListener("submit", calculateCalories);
}

if (clearButton) {
  clearButton.addEventListener("click", clearForm);
}

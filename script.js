const scrollerContainer = document.querySelector(".scroller-container");
const tableContainer = document.querySelector(".table-container");
const originalRow = document.querySelector(".data-row-container");
const addRowButton = document.querySelector(".add-course-button");
const resetButton = document.querySelector(".reset-button");
const calculateButton = document.querySelector(".calculate-button");

const modalContainer = document.querySelector(".modal-container");
const modalContent = document.querySelector(".modal-content");
const modalCloseButton = document.querySelector(".modal-close-button");


// add row functions
function rowCloning () {
    const newRow = originalRow.cloneNode(true);
    const inputs = newRow.querySelectorAll("input");

    for (let input of inputs) {
        input.value = "";
    }

    tableContainer.append(newRow);
}

function scrollingLogic () {
    const maxRow = 6;

    const headerRowHeight = tableContainer.querySelector(".header-row-container").offsetHeight;
    const dataRowHeight = tableContainer.querySelector(".data-row-container").offsetHeight;

    const rowCount = tableContainer.querySelectorAll(".data-row-container").length;

    const currentHeight = headerRowHeight + rowCount * dataRowHeight;
    const maxHeight = headerRowHeight + maxRow * dataRowHeight;
    
    if (currentHeight > maxHeight) {
        scrollerContainer.style.height = `${maxHeight}px`;
        scrollerContainer.classList.add("scroller-enabled");
    } else {
        scrollerContainer.style.height = "auto";
        scrollerContainer.classList.remove("scroller-enabled");
    }
}

function courseNumbering () {
    const existingRows = tableContainer.querySelectorAll(".data-row-container");

    existingRows.forEach((row, index) => {
        let courseNumberingCell = row.querySelector(".course-numbering-cell");

        if (courseNumberingCell) courseNumberingCell.placeholder = `Course ${index + 1}`;
    })
}   

function addRow() {
    rowCloning()
    courseNumbering()
    scrollingLogic()
}

addRowButton.addEventListener("click", addRow)


// remove row functions
function findRowToRemove(event) {
    const exactRowToRemove = event.target.closest(".delete-course-button");

    if (exactRowToRemove) { 
        const rowToRemove = exactRowToRemove.closest("tr");
        rowToRemove.remove()
    } return
}

function removeRow(event) {
    findRowToRemove(event)
    courseNumbering()
    scrollingLogic()
}

tableContainer.addEventListener("click", removeRow)


// reset row functions
function removeEveryRow() {
    const existingRows = tableContainer.querySelectorAll(".data-row-container");

    existingRows.forEach((row, index) => {
        if (index === 0) return;
        row.remove()
   })
}

function retainFirstRow() {
    const dataRowContainer = tableContainer.querySelector(".data-row-container");
    const inputs = dataRowContainer.querySelectorAll("input");
    const placeholderCell = dataRowContainer.querySelector(".course-numbering-cell");

    for (let input of inputs) {
        input.value = "";
    }

    placeholderCell.placeholder = "Course 1"
}

function resetTable() {
    removeEveryRow()
    retainFirstRow()
    scrollingLogic()
}

resetButton.addEventListener("click", resetTable)


// calculate GWA functions
function calculateGWA() {
    let totalWeighted = 0;
    let totalUnits = 0;
    let eligible = true;

    const rows = tableContainer.querySelectorAll(".data-row-container");

    for (let row of rows) {
        let gradeInput = row.querySelector("td:nth-child(2) input");
        let unitInput = row.querySelector("td:nth-child(3) input");

        let grades = parseFloat(gradeInput.value);
        let units = parseFloat(unitInput.value);

        if (grades < 2.5) eligible = false;

        totalWeighted += grades * units
        totalUnits += units
    }

    const gwa = (totalWeighted / totalUnits).toFixed(2)
    return {gwa, eligible}
}

function modalDisplay({gwa, eligible}) {
    if (isNaN(gwa)) return;

    modalContainer.style.display = "flex"

    const gwaDisplay = modalContent.querySelector("h1")
    gwaDisplay.textContent = `GWA: ${gwa}`

    const congratsMessage = modalContent.querySelector("p")

    if (eligible && gwa > 3.50) {
        congratsMessage.textContent = "Congrats, you achieved Dean's Lister first honors!"
    } else if (eligible && gwa > 3.25) {
        congratsMessage.textContent = "Congrats, you achieved Dean's Lister second honors!"
    } else {
        congratsMessage.textContent = `You need a minimum GWA of 3.25, as well as, no individual grades lower than 2.5.
                                       Aus lang yan, kahit naman si Lebron James 'di nagcchampion kada taon Bawi tau 
                                       niyan next sem!`
    }

    modalCloseButton.addEventListener("click", () => {
        modalContainer.style.display = "none"
    })
}

function displayGWA() {
    const result = calculateGWA()
    modalDisplay(result)
}

calculateButton.addEventListener("click", displayGWA)
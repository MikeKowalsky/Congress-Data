
//when page is loaded than call function buildTable
onload = (function(){ 
    // console.log("Page fully loaded!");
    const tbl = document.getElementById("table-data");
    const allMembers = data.results[0].members;

    buildTableHeader(tbl)
    buildTableRest(tbl, allMembers);
});

function buildTableHeader(myTable){
    const tableHeaderCellsArray = ["Name", "Party", "State", "Seniority", "% Votes w/ Party"];
    const newTHead = document.createElement("thead");
    const newRow = document.createElement("tr");

    tableHeaderCellsArray.forEach(oneTH => {
        const newCell = document.createElement("th");
        newCell.innerHTML = oneTH;
        newRow.append(newCell);
    });

    newTHead.append(newRow);
    newTHead.classList.add('bg-warning', 'text-center');
    newRow.firstChild.classList.add('text-left');
    myTable.append(newTHead);
}

//biuld rest of the table
function buildTableRest(myTable, myMembers){
    const newTBody = document.createElement("tbody");

    myMembers.forEach(oneMember => {
        const newRow = buildNewRow(oneMember);
        newTBody.append(newRow);
    });

    myTable.append(newTBody);
}

//biuld one row
function buildNewRow(currentMember) {

    //array with content for certain fields for current member
    const fieldsContentArray = ["<a href=\"" + currentMember.url + "\">" + currentMember.last_name + " " + ((currentMember.middle_name == null) ? " " : (currentMember.middle_name + " ")) + currentMember.first_name + "</a>", 
                              currentMember.party, 
                              currentMember.state, 
                              currentMember.seniority, 
                              currentMember.votes_with_party_pct];

    //add new row
    const newRow = document.createElement("tr");
    newRow.classList.add('text-center');

    //add new cells to this new row
    fieldsContentArray.forEach(oneTD => {
        const newCell = document.createElement("td");
        newCell.innerHTML = oneTD;
        newRow.append(newCell);
    });
    newRow.firstChild.classList.add('text-left');
    return newRow;
}

function filterMembers(){
    const tbl = document.getElementById("table-data");
    const allMembers = data.results[0].members;
    let selectedMembers = [];

    //check which checboxes are checked and put values into array
    const checkBoxesValuesArray = Array.from(document.querySelectorAll('input[name=checkboxes]:checked'))
                                       .map(checkedCheckbox => checkedCheckbox.value);
    // console.log(checkBoxesValuesArray);

    //check which states are selected and put values into array
    const selectedStateArray = Array.from(document.querySelectorAll('option'))
                                    .filter(stateOption => stateOption.selected === true)
                                    .map(selectedStateOption => selectedStateOption.value);
    // console.log(selectedStateArray);

    if((checkBoxesValuesArray.length === 0 || checkBoxesValuesArray.length === 3) 
        && (selectedStateArray.length ===  0 || selectedStateArray.includes('all'))){
        //if no party or all parties is selected and no state or "all" stetes are selected
        selectedMembers = allMembers;
    } else {
        //some parties and some states
        allMembers.forEach((oneMember) => {
            if ((checkBoxesValuesArray.includes(oneMember.party) || checkBoxesValuesArray.length === 0) 
                    && (selectedStateArray.includes(oneMember.state) || selectedStateArray.length ===  0 || selectedStateArray.includes('all'))){
                selectedMembers.push(oneMember);
            }
        });
    }

    rmvTBody(tbl);
    console.log('Number of rows: ' + selectedMembers.length)
    buildTableRest(tbl, selectedMembers);
}

//remove old tbody
function rmvTBody(myTable) {
    myTable.removeChild(myTable.childNodes[1]);
}
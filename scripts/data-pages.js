var data;

//when page is loaded than call for  date
onload = (function(){
    
    let url = '';
    (document.title.includes('Senate')) ? url = 'https://api.myjson.com/bins/10be9l' : url = 'https://api.myjson.com/bins/1fzbyp';
    // (document.title.includes('Senate')) ? 
    //     url = 'https://api.propublica.org/congress/v1/113/senate/members.json' : 
    //     url = 'https://api.propublica.org/congress/v1/113/house/members.json';

    fetch(url)
    // fetch(url, {
    // 	headers: new Headers({
    //     'X-API-Key': 'usOMuQb7H1gDEgsMArhgUa5Pefz1BxSbxrdMK4LJ'
    //     })
    // })
    .then (response => response.json())
    .then ((jsonData) => {
        data = jsonData;            
        (document.title == 'Senate' || document.title == 'House') ? dataPages() : statisticsPages();
    });
});

//main function
function dataPages(){

    const tbl = document.getElementById("table-data");
    const allMembers = data.results[0].members;
    // console.log(allMembers[0]);

    const selectElement = document.getElementById("stateSelect");
    createOptionElements(allMembers, selectElement);

    const tableHeaderCellsArray = ["Name", "Party", "State", "Seniority", "% Votes w/ Party"];
    buildTableHeader(tableHeaderCellsArray, tbl)
    buildTableRest(tbl, allMembers);

    // tbl.DataTable({
    //     "order": [[ 3, "desc" ]]
    // });
}

//building table
//
function buildTableHeader(headerCellsArray, htmlElement){

    const newTHead = document.createElement('thead');
    const newRow = document.createElement('tr');

    headerCellsArray.forEach(headerCell => {
        let newTH = document.createElement('th');
        newTH.innerHTML = headerCell;
        newRow.append(newTH);
    });
    
    newRow.firstChild.classList.add('text-left');
    newTHead.append(newRow);
    newTHead.classList.add('bg-warning', 'text-center');
    htmlElement.append(newTHead);
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

    const nameFieldContent = createNameCellContent(currentMember);
    
    //array with content for certain fields for current member
    let fieldsContentArray = [nameFieldContent, currentMember.party, currentMember.state, currentMember.seniority, currentMember.votes_with_party_pct];

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
    newRow.firstChild.firstChild.setAttribute('target', '_blank');
    return newRow;
}

// filter function
//
function filterMembers(){
    const tbl = document.getElementById("table-data");
    const allMembers = data.results[0].members;
    let selectedMembers = [];

    //check which checboxes are checked and put values into array
    const checkBoxesValuesArray = Array.from(document.querySelectorAll('input[name=checkboxes]:checked'))
                                       .map(checkedCheckbox => checkedCheckbox.value);

    //check which states are selected and put values into array
    const selectedStateArray = Array.from(document.querySelectorAll('option'))
                                    .filter(stateOption => stateOption.selected === true)
                                    .map(selectedStateOption => selectedStateOption.value);

    if((checkBoxesValuesArray.length === 0 || checkBoxesValuesArray.length === 3) 
        && (selectedStateArray.length ===  0 || selectedStateArray.includes('all'))){
        selectedMembers = allMembers;
    } else {
        selectedMembers = allMembers.filter(oneMember => (checkBoxesValuesArray.includes(oneMember.party) || checkBoxesValuesArray.length === 0) 
                    && (selectedStateArray.includes(oneMember.state) || selectedStateArray.length ===  0 || selectedStateArray.includes('all')));
    }

    rmvTBody(tbl);
    buildTableRest(tbl, selectedMembers);
}

//other small functions
//remove old tbody
function rmvTBody(myTable) {
    myTable.removeChild(myTable.childNodes[1]);
}

function createNameCellContent(currentMember){
    return (currentMember.last_name + " " + 
            ((currentMember.middle_name == null) ? " " : (currentMember.middle_name + " ")) + 
            currentMember.first_name).link(currentMember.url);
}

function createOptionElements(allMembers, mySelect) {
    const allStates = []; 
    
    allMembers.forEach(member => {
        if(!allStates.includes(member.state)){
            allStates.push(member.state);
        }
    });

    allStates.sort().forEach(state => {
        const newOption = document.createElement('option');
        newOption.innerHTML = state;
        mySelect.append(newOption);
    });
}
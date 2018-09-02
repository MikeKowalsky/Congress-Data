
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
        data = jsonData.results[0].members;
        document.querySelector('#loader').style.display =  'none';          
        document.querySelector('#wholeContent').style.display = 'block';          
        (document.title == 'Senate' || document.title == 'House') ? dataPages(data) : statisticsPages(data);
    });
});

//main function
function dataPages(allMembers){

    const tblBody = document.getElementById("dataTBody");
    const tblHead = document.getElementById("dataTHead");
    const selectElement = document.getElementById("stateSelect");
    
    createOptionElements(allMembers, selectElement);
    activateEventList(selectElement, tblBody, allMembers);

    const tableHeaderCellsArray = ["Name", "Party", "State", "Seniority", "% Votes w/ Party"];
    buildTableHeader(tblHead, tableHeaderCellsArray);
    buildTableRest(tblBody, filterMembers(allMembers));

    // tbl.DataTable({
    //     "order": [[ 3, "desc" ]]
    // });
}

//activate eventlisteners
function activateEventList(selectElement, tblBody, allMembers){
    document.querySelector('#chckR').addEventListener('click', () => buildTableRest(tblBody, filterMembers(allMembers)));
    document.querySelector('#chckD').addEventListener('click', () => buildTableRest(tblBody, filterMembers(allMembers)));
    document.querySelector('#chckI').addEventListener('click', () => buildTableRest(tblBody, filterMembers(allMembers)));
    selectElement.addEventListener('change', () => buildTableRest(tblBody, filterMembers(allMembers)));
}

//building table
//
function buildTableHeader(htmlElement, headerCellsArray){    
    const newRow = document.createElement('tr');

    headerCellsArray.forEach(headerCell => {
        let newTH = document.createElement('th');
        newTH.innerHTML = headerCell;
        newRow.append(newTH);
    });
    
    newRow.firstChild.classList.add('text-left');
    htmlElement.append(newRow);
}

//biuld rest of the table
function buildTableRest(myHtmlEl, filtredMembers){
    myHtmlEl.innerHTML = '';

    filtredMembers.forEach(oneMember => {
        const newRow = buildNewRow(oneMember);
        myHtmlEl.append(newRow);
    });
}

//biuld one row
function buildNewRow(currentMember) {

    const nameFieldContent = createNameCellContent(currentMember);
    
    //array with content for certain fields for current member
    let fieldsContentArray = [nameFieldContent, currentMember.party, currentMember.state, currentMember.seniority, currentMember.votes_with_party_pct.toFixed(2)];

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

function filterMembers(members){
    //check which checboxes are checked and put values into array
    const checkBoxesValuesArray = Array.from(document.querySelectorAll('input[name=checkboxes]:checked'))
                                        .map(checkedCheckbox => checkedCheckbox.value);

    //check which states are selected and put values into array
    const selectedStateArray = Array.from(document.querySelectorAll('option'))
                                    .filter(stateOption => stateOption.selected === true)
                                    .map(selectedStateOption => selectedStateOption.value);
    
    return members.filter(oneMember => {
        const partyFilterValue = checkBoxesValuesArray.length === 0 || checkBoxesValuesArray.includes(oneMember.party);
        const stateFilterValue = selectedStateArray.length ===  0 || selectedStateArray.includes('all') || selectedStateArray.includes(oneMember.state);
        return partyFilterValue && stateFilterValue;
    });   
}

//other small functions
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
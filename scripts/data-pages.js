var data;

//when page is loaded than call function buildTable
onload = (function(){ 
    // console.log("Page fully loaded!");

    // baguetteBox.run('.baguetteBox');
    // $('.colorBox').colorbox({iframe:true, innerWidth:425, innerHeight:344});
    // $('.colorBox').colorbox();
    
    
    let url = '';
    if(document.title == 'Senate' || document.title == 'Senate-Attendance' || document.title == 'Senate-Loyalty'){
        url = 'https://api.myjson.com/bins/10be9l';
        //url = 'https://api.propublica.org/congress/v1/113/senate/members.json'
    } else if (document.title == 'House' || document.title == 'House-Attendance' || document.title == 'House-Loyalty'){
        url = 'https://api.myjson.com/bins/1fzbyp';
        // url = 'https://api.propublica.org/congress/v1/113/house/members.json'
    }

    fetch(url)
    // fetch(url, {
    // 	headers: new Headers({
    //     'X-API-Key': 'usOMuQb7H1gDEgsMArhgUa5Pefz1BxSbxrdMK4LJ'
    //     })
    // })
    .then (response => response.json())
    .then ((jsonData) => {
        data = jsonData;            
        if(document.title == 'Senate' || document.title == 'House'){
            dataPages();
        } else {
            statisticsPages();
        }
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

    // $(".iframe").colorbox({iframe:true, width:"80%", height:"80%"});

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
    // newRow.firstChild.firstChild.classList.add('colorBox');
    // newRow.firstChild.firstChild.classList.add('iframe', 'cboxElement');
    return newRow;
}

// filter function
//
function filterMembers(){
    const tbl = document.getElementById("table-data");
    const allMembers = data.results[0].members;
    const selectedMembers = [];

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
        selectedMembers = allMembers;
    } else {
        allMembers.forEach((oneMember) => {
            if ((checkBoxesValuesArray.includes(oneMember.party) || checkBoxesValuesArray.length === 0) 
                    && (selectedStateArray.includes(oneMember.state) || selectedStateArray.length ===  0 || selectedStateArray.includes('all'))){
                selectedMembers.push(oneMember);
            }
        });
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
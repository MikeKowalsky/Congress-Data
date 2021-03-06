function statisticsPages(allMembers){
    var statistics = {
        "noOfDem": 0,
        "noOfRep": 0,
        "noOfInd": 0,
        "noOfTotal": 0,
        "demArray": [],
        "repArray": [],
        "indArray": [],
        "votesWPartDem": 0,
        "votesWPartRep": 0,
        "votesWPartInd": 0,
        "votesWPartTotal": 0,
        "leastLoyal" : [],
        "mostLoyal" : [],
        "leastEngaged" : [],
        "mostEngaged" : []
    };

    statistics.repArray = createPartyArray(allMembers, "R");
    statistics.demArray = createPartyArray(allMembers, "D");
    statistics.indArray = createPartyArray(allMembers, "I");

    statistics.noOfRep = statistics.repArray.length; 
    statistics.noOfDem = statistics.demArray.length; 
    statistics.noOfInd = statistics.indArray.length;
    statistics.noOfTotal = allMembers.length;

    statistics.votesWPartDem = parseFloat(countAvgVotesWithParty(statistics.demArray));
    statistics.votesWPartRep = parseFloat(countAvgVotesWithParty(statistics.repArray));
    statistics.votesWPartInd = parseFloat(countAvgVotesWithParty(statistics.indArray));
    statistics.votesWPartTotal = parseFloat(countAvgVotesWithParty(allMembers));

    const glanceTableHeader = ['Party', 'No. of Reps', '% Voted w/ Party'];
    const loyaltyTableHeader = ['Name', 'No. Party Votes', '% Party Votes'];
    const attendanceTableHeader = ['Name', 'No. Missed Votes', '% Missed'];

    //glance
    const glanceTable = document.querySelector('#glance');
    const glanceArray = ['Democrats', 'Republicans', 'Independents', 'Total'];
    buildSmallTableHeader(glanceTable, glanceTableHeader);
    biuldSmallTableRest(glanceTable, glanceArray, 'glance', statistics);
    document.querySelector('#glance tbody').lastChild.classList.add('font-weight-bold')

    //attendance
    const mostEngagedTable = document.querySelector('#mostEngaged');
    const leastEngagedTable = document.querySelector('#leastEngaged');
    if (leastEngagedTable != null){
        statistics.leastEngaged = attendance(allMembers, 'lowest');
        buildSmallTableHeader(leastEngagedTable, attendanceTableHeader);
        biuldSmallTableRest(leastEngagedTable, statistics.leastEngaged, 'att');
    
        statistics.mostEngaged = attendance(allMembers, 'highest');
        buildSmallTableHeader(mostEngagedTable, attendanceTableHeader);
        biuldSmallTableRest(mostEngagedTable, statistics.mostEngaged, 'att');
    }

    //loyalty
    const leastLoyalTable = document.querySelector('#leastLoyal');
    const mostLoyalTable = document.querySelector('#mostLoyal');
    if(leastLoyalTable != null){
        statistics.leastLoyal = loyalty(allMembers, 'least');
        buildSmallTableHeader(leastLoyalTable, loyaltyTableHeader);
        biuldSmallTableRest(leastLoyalTable, statistics.leastLoyal, 'loyalty');
    
        statistics.mostLoyal = loyalty(allMembers, 'most');
        buildSmallTableHeader(mostLoyalTable, loyaltyTableHeader);
        biuldSmallTableRest(mostLoyalTable, statistics.mostLoyal, 'loyalty');
    }
}

//calculating statistics
//
function createPartyArray(allMembers, partySign){
    return allMembers.filter(member => member.party === partySign);
}

function countAvgVotesWithParty(myArray){
    let sum = 0;
    myArray.forEach(member => sum+=member.votes_with_party_pct);
    return (sum/myArray.length).toFixed(2);
}

function loyalty(myArray, direction){
    const tenPctValue = Math.round(myArray.length/10);
    if(direction === 'least'){
        return myArray.sort((a, b) => a.votes_with_party_pct - b.votes_with_party_pct)
                      .filter(member => member.votes_with_party_pct <= myArray[tenPctValue-1].votes_with_party_pct);
    } else {
        return myArray.sort((a, b) => b.votes_with_party_pct - a.votes_with_party_pct)
                      .filter(member => member.votes_with_party_pct >= myArray[tenPctValue-1].votes_with_party_pct);
    }    
}

function attendance(myArray, direction){
    const tenPctValue = Math.round(myArray.length/10);
    if(direction === 'highest'){
        return myArray.sort((a, b) => a.missed_votes - b.missed_votes)
                    .filter(member => member.missed_votes <= myArray[tenPctValue-1].missed_votes);
    } else {
        return myArray.sort((a, b) => b.missed_votes - a.missed_votes)
                    .filter(member => member.missed_votes >= myArray[tenPctValue-1].missed_votes);
    }
}

function countPartyVotes(currentMember){
    return Math.round((currentMember.total_votes * currentMember.votes_with_party_pct)/100);
}

//build new tables
//build header
function buildSmallTableHeader(htmlElement, headerCellsArray){
    const newTHead = document.createElement('thead');    
    const newRow = document.createElement('tr');

    headerCellsArray.forEach(headerCell => {
        let newTH = document.createElement('th');
        newTH.innerHTML = headerCell;
        newRow.append(newTH);
    });
    
    newRow.classList.add('text-center', 'bg-warning');
    newRow.firstChild.classList.add('text-left');
    newTHead.append(newRow);
    htmlElement.append(newTHead);
}

//biuld rest of the table
function biuldSmallTableRest(myTable, myArray, tableType, statistics){
    const newTBody = document.createElement("tbody");
    myArray.forEach(element => {
            const newRow = buildSmallNewRow(element, tableType, statistics);
            newTBody.append(newRow);
        });
    myTable.append(newTBody);
}

//biuld one row
function buildSmallNewRow(currentMember, tableType, statistics) {

    const nameFieldContent = createNameCellContent(currentMember);
    const votesWithPartyContent = countPartyVotes(currentMember);
    let fieldsContentArray = [];

    //array with content for certain fields for current member    
    if(tableType === 'loyalty'){
        fieldsContentArray = [nameFieldContent, votesWithPartyContent, currentMember.votes_with_party_pct.toFixed(2)];
    } else if(tableType === 'att'){
        fieldsContentArray = [nameFieldContent, currentMember.missed_votes, currentMember.missed_votes_pct.toFixed(2)];
    } else if(tableType === 'glance'){
        if(currentMember === 'Democrats'){
            fieldsContentArray = [currentMember, statistics.noOfDem, statistics.votesWPartDem];
        } else if(currentMember === 'Republicans'){
            fieldsContentArray = [currentMember, statistics.noOfRep, statistics.votesWPartRep];
        } else if(currentMember === 'Independents'){
            fieldsContentArray = statistics.noOfInd == 0 ? [currentMember, '-', '-'] : [currentMember, statistics.noOfInd, statistics.votesWPartInd];
        } else {
            fieldsContentArray = [currentMember, statistics.noOfTotal, statistics.votesWPartTotal];
        }
    }

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
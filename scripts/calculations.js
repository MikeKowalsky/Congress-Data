
var statistics = {
        "noOfDem": 0,
        "noOfRep": 0,
        "noOfInd": 0,
        "votesWPartDem": 0,
        "votesWPartRep": 0,
        "votesWPartInd": 0,
        "leastLoyal" : [],
        "mostLoyal" : []
};

onload = (function(){ 

    const allMembers = data.results[0].members;
    console.log(allMembers);
    console.log(allMembers[0]);

    const treeArrayObject = countPartyMembers(allMembers);
    statistics.votesWPartDem = parseFloat(votesWithParty(treeArrayObject.demArr));
    statistics.votesWPartRep = parseFloat(votesWithParty(treeArrayObject.repArr));
    statistics.votesWPartInd = parseFloat(votesWithParty(treeArrayObject.indArr));

    const countPartyTableHeader = ['Part', 'No. of Reps', '% Voted w/ Party'];
    const loyaltyTableHeader = ['Name', 'No. Party Votes', '%Party Votes'];
    const attendanceTableHeader = ['Name', 'No. Missed Votes', '%Missed'];

    statistics.leastLoyal = loyalty(allMembers, 'least');
    const leastLoyalTable = document.querySelector('#leastLoyal');
    buildTableHeader(loyaltyTableHeader, leastLoyalTable);
    biuldSmallTableRest(leastLoyalTable, statistics.leastLoyal);

    statistics.mostLoyal = loyalty(allMembers, 'most');
    const mostLoyalTable = document.querySelector('#mostLoyal');
    buildTableHeader(loyaltyTableHeader, mostLoyalTable);
    biuldSmallTableRest(mostLoyalTable, statistics.mostLoyal);

    console.log(statistics);
});

function countPartyMembers(myArray){
    let demArray = [];
    let repArray = [];
    let indArray = [];

    myArray.forEach(member => {
        if(member.party === 'D'){
            demArray.push(member);
        } else if (member.party === 'R'){
            repArray.push(member);
        } else {
            indArray.push(member);
        }
    });

    statistics.noOfDem = demArray.length;
    statistics.noOfRep = repArray.length;
    statistics.noOfInd = indArray.length;
    return {demArr:demArray, repArr:repArray, indArr:indArray};
}

function votesWithParty(myArray){
    let sum = 0;
    myArray.forEach(member => sum+=member.votes_with_party_pct);
    return (sum/myArray.length).toFixed(2);
}

function loyalty(myArray, direction){

    let votesWithPartyValuesNoDuplicates = [];
    myArray.forEach(member => {
        if(!votesWithPartyValuesNoDuplicates.includes(member.votes_with_party_pct)){
            votesWithPartyValuesNoDuplicates.push(member.votes_with_party_pct)
        }
    });

    if(direction === 'least'){
        const tenPercentValuesArray = votesWithPartyValuesNoDuplicates.sort((a,b) => a - b)
                                                                      .slice(0, 10);
        return myArray.filter(member => tenPercentValuesArray.includes(member.votes_with_party_pct))
                                                             .sort((a, b) => a.votes_with_party_pct - b.votes_with_party_pct); 
    } else {
        const tenPercentValuesArray = votesWithPartyValuesNoDuplicates.sort((a,b) => b - a)
                                                                      .slice(0, 10);
        return myArray.filter(member => tenPercentValuesArray.includes(member.votes_with_party_pct))
                                                             .sort((a, b) => b.votes_with_party_pct - a.votes_with_party_pct);
    }    
}

function biuldSmallTableRest(){

    let fieldsContentArray = [nameFieldContent, 
                             Math.round((currentMember.total_votes * currentMember.votes_with_party_pct)/100), 
                             currentMember.votes_with_party_pct];


}
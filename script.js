let recentRowsDisplayed = 2; // Variable to keep track of the number of recent rows displayed
let upcomingRowsDisplayed = 2; // Variable to keep track of the number of upcoming rows displayed
let showRecentButtonAdded = false; // Variable to track if "Show More" button for recent matches has been added
let showUpcomingButtonAdded = false; // Variable to track if "Show More" button for upcoming matches has been added
let currentLeague = "Indian Premier League"; // Variable to store the current league
let showRecentButton; // Variable to store reference to "Show More" button for recent matches
let showUpcomingButton; // Variable to store reference to "Show More" button for upcoming matches
//616efe51-c75d-4763-9ac5-44f81d322268

async function getMatchData(league) {
    // Fetching data 
    return await fetch("https://api.cricapi.com/v1/cricScore?apikey=a829c5ef-4172-4419-96ca-c57036cb4bbb")
        .then(data => data.json()
            .then(data => {
                if (data.status != "success") return;

                const matchList = data.data;

                if (!matchList || matchList.length === 0) {
                    document.getElementById("live_rows").innerHTML = "<h4>No matches live!</h4>";
                    document.getElementById("matches_today").innerHTML = "<h4>No matches today!</h4>";
                    return;
                }

                var today = new Date(new Date().toLocaleDateString('en-US', {
                    timeZone: 'America/New_York'
                })).toISOString().split('T')[0];

                const liveData = matchList.filter(match => match.series.includes(league) && match.dateTimeGMT.split('T')[0] == today && match.ms == "live");
                const newLiveHTML = liveData.map(match => {
                    const team1Logo = match.t1img;
                    const team2Logo = match.t2img;
                    let team1Score = match.t1s;
                    let team2Score = match.t2s;
                    const team1Name = match.t1.substring(match.t1.indexOf("[") + 1, match.t1.indexOf("]"));
                    const team2Name = match.t2.substring(match.t2.indexOf("[") + 1, match.t2.indexOf("]"));

                    if (team1Score == "") {
                        team1Score = "0/0 (0)";
                    }
                    if (team2Score == "") {
                        team2Score = "0/0 (0)";
                    }

                    return `
                        <tr>
                            <td>
                                <img src="${team1Logo}" alt="${match.t1}" ><br>
                                ${team1Name} <br>${team1Score}
                            </td>
                            <td>${match.status}</td>
                            <td>
                                <img src="${team2Logo}" alt="${match.t2}" ><br>
                                ${team2Name} <br>${team2Score}
                            </td>
                        </tr>`;
                }).join('');

                document.getElementById("matches_live").innerHTML = "";
                document.getElementById("matches_live").innerHTML = `
                <tr>
                    <th>Team 1</th>
                    <th>Match Status</th>
                    <th>Team 2</th>
                </tr>
                ${newLiveHTML || "<tr><td colspan='3'>No matches live!</td></tr>"}`;

                const todayData = matchList.filter(match => match.series.includes(league) && match.dateTimeGMT.split('T')[0] == today);
                const newTodayHTML = todayData.map(match => {
                    const team1Logo = match.t1img;
                    const team2Logo = match.t2img;
                    let team1Score = match.t1s;
                    let team2Score = match.t2s;
                    const team1Name = match.t1.substring(match.t1.indexOf("[") + 1, match.t1.indexOf("]"));
                    const team2Name = match.t2.substring(match.t2.indexOf("[") + 1, match.t2.indexOf("]"));

                    if (team1Score == "") {
                        team1Score = "0/0 (0)";
                    }
                    if (team2Score == "") {
                        team2Score = "0/0 (0)";
                    }

                    return `
                        <tr>
                            <td>
                                <img src="${team1Logo}" alt="${match.t1}"><br>
                                ${team1Name}<br>${team1Score}
                            </td>
                            <td>${match.status} &nbsp;<b style="color: navy; font-size: 13px; text-transform: uppercase;">${match.ms}</b></td>
                            <td>
                                <img src="${team2Logo}" alt="${match.t2}"><br>
                                ${team2Name}<br>${team2Score}
                            </td>
                        </tr>`;
                }).join('');

                document.getElementById("matches_today").innerHTML = "";
                document.getElementById("matches_today").innerHTML = `
                <tr>
                    <th>Team 1</th>
                    <th>Match Status</th>
                    <th>Team 2</th>
                </tr>
                ${newTodayHTML || "<tr><td colspan='3'>No matches today!</td></tr>"}`;

                const recentData = matchList.filter(match => match.series.includes(league) && match.dateTimeGMT.split('T')[0] < today);
                const newRecentHTML = recentData.map((match, index) => {
                    if (index < recentRowsDisplayed) {
                        const team1Logo = match.t1img;
                        const team2Logo = match.t2img;
                        let team1Score = match.t1s;
                        let team2Score = match.t2s;
                        const team1Name = match.t1.substring(match.t1.indexOf("[") + 1, match.t1.indexOf("]"));
                        const team2Name = match.t2.substring(match.t2.indexOf("[") + 1, match.t2.indexOf("]"));

                        if (team1Score == "") {
                            team1Score = "0/0 (0)";
                        }
                        if (team2Score == "") {
                            team2Score = "0/0 (0)";
                        }

                        return `
                            <tr>
                                <td>
                                    <img src="${team1Logo}" alt="${match.t1}" ><br>
                                    ${team1Name} <br>${team1Score}
                                </td>
                                <td>${match.status}</td>
                                <td>
                                    <img src="${team2Logo}" alt="${match.t2}" ><br>
                                    ${team2Name}<br> ${team2Score}
                                </td>
                            </tr>`;
                    }
                }).join('');

                document.getElementById("matches_recent").innerHTML = "";
                document.getElementById("matches_recent").innerHTML = `
                <tr>
                    <th>Team 1</th>
                    <th>Match Result</th>
                    <th>Team 2</th>
                </tr>
                ${newRecentHTML || "<tr><td colspan='3'>No recent matches!</td></tr>"}`;

                if (recentData.length > recentRowsDisplayed && !showRecentButtonAdded) {
                    showRecentButton = document.createElement('button');
                    showRecentButton.textContent = 'Show More';
                    showRecentButton.addEventListener('click', () => {
                        if (showRecentButton.textContent === 'Show More') {
                            showRecentButton.textContent = 'Show Less';
                            recentRowsDisplayed = recentData.length;
                        } else {
                            showRecentButton.textContent = 'Show More';
                            recentRowsDisplayed = 2;
                        }
                        document.getElementById("matches_recent").innerHTML = '';
                        getMatchData(currentLeague);
                    });
                    document.getElementById("recentButtonContainer").appendChild(showRecentButton);

                    showRecentButtonAdded = true;
                }

                const upcomingData = matchList.filter(match => match.series.includes(league) && match.dateTimeGMT.split('T')[0] > today);
                const newUpcomingHTML = upcomingData.map((match, index) => {
                    if (index < upcomingRowsDisplayed) {
                        const team1Logo = match.t1img;
                        const team2Logo = match.t2img;
                        let team1Score = match.t1s;
                        let team2Score = match.t2s;
                        const team1Name = match.t1.substring(match.t1.indexOf("[") + 1, match.t1.indexOf("]"));
                        const team2Name = match.t2.substring(match.t2.indexOf("[") + 1, match.t2.indexOf("]"));

                        if (team1Score == "") {
                            team1Score = "0/0 (0)";
                        }
                        if (team2Score == "") {
                            team2Score = "0/0 (0)";
                        }

                        return `
                            <tr>
                                <td>
                                    <img src="${team1Logo}" alt="${match.t1}" ><br>
                                    ${team1Name} <br>${team1Score}
                                </td>
                                <td>${match.status}</td>
                                <td>
                                    <img src="${team2Logo}" alt="${match.t2}" ><br>
                                    ${team2Name}<br> ${team2Score}
                                </td>
                            </tr>`;
                    }
                }).join('');

                document.getElementById("matches_upcoming").innerHTML = "";
                document.getElementById("matches_upcoming").innerHTML = `
                <tr>
                    <th>Team 1</th>
                    <th>Match Result</th>
                    <th>Team 2</th>
                </tr>
                ${newUpcomingHTML || "<tr><td colspan='3'>No upcoming matches!</td></tr>"}`;

                if (upcomingData.length > upcomingRowsDisplayed && !showUpcomingButtonAdded) {
                    showUpcomingButton = document.createElement('button');
                    showUpcomingButton.textContent = 'Show More';
                    showUpcomingButton.addEventListener('click', () => {
                        if (showUpcomingButton.textContent === 'Show More') {
                            showUpcomingButton.textContent = 'Show Less';
                            upcomingRowsDisplayed = upcomingData.length;
                        } else {
                            showUpcomingButton.textContent = 'Show More';
                            upcomingRowsDisplayed = 2;
                        }
                        document.getElementById("matches_upcoming").innerHTML = '';
                        getMatchData(currentLeague);
                    });
                    document.getElementById("upcomingButtonContainer").appendChild(showUpcomingButton);

                    showUpcomingButtonAdded = true;
                }
            })
        );
}

const dropDown = document.getElementById('leagueDropdown');

dropDown.addEventListener('change', function() {
    currentLeague = dropDown.value;
    getMatchData(currentLeague);

    // Reset "Show More" buttons and their states
    resetShowMoreButtons();
    
    if(currentLeague !== "Indian Premier League") {
        const boardElement = document.getElementById("board");
        if(boardElement) {
            boardElement.style.display = "none"; // Hide the element
        }
    } else {
        if(!document.getElementById("board")) {
            const board = document.createElement("div");
            board.id = "board";
            document.body.appendChild(board); // Append it to the body or any other parent element
        } else {
            const boardElement = document.getElementById("board");
            boardElement.style.display = ""; // Show the element (make sure to clear the display property)
        }
    }
});

// Function to reset "Show More" buttons and their states
function resetShowMoreButtons() {
    if (showRecentButton) {
        showRecentButton.textContent = 'Show More';
    }
    if (showUpcomingButton) {
        showUpcomingButton.textContent = 'Show More';
    }
    recentRowsDisplayed = 2;
    upcomingRowsDisplayed = 2;
}

getMatchData("Indian Premier League");
dark();
function dark() { 
    // the css we are going to inject
    var css = 'html {-webkit-filter: invert(100%);' +
        '-moz-filter: invert(100%);' + 
        '-o-filter: invert(100%);' + 
        '-ms-filter: invert(100%); }',
    
    head = document.getElementsByTagName('head')[0],
    style = document.createElement('style');
    
    // // a hack, so you can "invert back" clicking the bookmarklet again
    // if (!window.counter) { window.counter = 1;} else  { window.counter ++;
    // if (window.counter % 2 == 0) { var css ='html {-webkit-filter: invert(0%); -moz-filter:    invert(0%); -o-filter: invert(0%); -ms-filter: invert(0%); }'}
    //  };
    
    style.type = 'text/css';
    if (style.styleSheet){
    style.styleSheet.cssText = css;
    } else {
    style.appendChild(document.createTextNode(css));
    }
    
    //injecting the css to the head
    head.appendChild(style);
    };

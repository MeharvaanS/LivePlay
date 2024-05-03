let recentRowsDisplayed = 2; // Variable to keep track of the number of recent rows displayed
let upcomingRowsDisplayed = 2; // Variable to keep track of the number of upcoming rows displayed
let showRecentButtonAdded = false; // Variable to track if "Show More" button for recent matches has been added
let showUpcomingButtonAdded = false; // Variable to track if "Show More" button for upcoming matches has been added

async function getMatchData(league) {
    // Fetching data 
    return await fetch("https://api.cricapi.com/v1/cricScore?apikey=616efe51-c75d-4763-9ac5-44f81d322268")
    // return await fetch("TestData.json")
        .then(data => data.json()
            .then(data => {
                if (data.status != "success") return;

                const matchList = data.data;

                if (!matchList || matchList.length === 0) {
                    document.getElementById("live_rows").innerHTML = "<h4>No matches live!</h4>";
                    document.getElementById("matches_today").innerHTML = "<h4>No matches today!</h4>";
                    return;
                }

                // Get today's date
                var today = new Date(new Date().toLocaleDateString('en-US', {
                    timeZone: 'America/New_York'
                })).toISOString().split('T')[0];

                // Filtering live matches
                const liveData = matchList.filter(match => match.series.includes(league) && match.dateTimeGMT.split('T')[0] == today && match.ms == "live");
                const newLiveHTML = liveData.map(match => {
                    // Extracting necessary information for each match
                    const team1Logo = match.t1img;
                    const team2Logo = match.t2img;
                    let team1Score = match.t1s;
                    let team2Score = match.t2s;
                    const team1Name = match.t1.substring(match.t1.indexOf("[") + 1, match.t1.indexOf("]"));
                    const team2Name = match.t2.substring(match.t2.indexOf("[") + 1, match.t2.indexOf("]"));

                    // Handling cases where scores are not available
                    if (team1Score == "") {
                        team1Score = "0/0 (0)";
                    }
                    if (team2Score == "") {
                        team2Score = "0/0 (0)";
                    }

                    // Generating HTML for each live match
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

                // Clear live matches table before appending new HTML
                document.getElementById("matches_live").innerHTML = "";
                // Appending live matches HTML to the live matches table
                document.getElementById("matches_live").innerHTML = `
                <tr>
                    <th>Team 1</th>
                    <th>Match Status</th>
                    <th>Team 2</th>
                </tr>
                ${newLiveHTML || "<tr><td colspan='3'>No matches live!</td></tr>"}`;

                // Filtering matches scheduled for today
                const todayData = matchList.filter(match => match.series.includes(league) && match.dateTimeGMT.split('T')[0] == today);
                const newTodayHTML = todayData.map(match => {
                    // Extracting necessary information for each match
                    const team1Logo = match.t1img;
                    const team2Logo = match.t2img;
                    let team1Score = match.t1s;
                    let team2Score = match.t2s;
                    const team1Name = match.t1.substring(match.t1.indexOf("[") + 1, match.t1.indexOf("]"));
                    const team2Name = match.t2.substring(match.t2.indexOf("[") + 1, match.t2.indexOf("]"));

                    // Handling cases where scores are not available
                    if (team1Score == "") {
                        team1Score = "0/0 (0)";
                    }
                    if (team2Score == "") {
                        team2Score = "0/0 (0)";
                    }

                    // Generating HTML for each match scheduled for today
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

                // Clear today's matches table before appending new HTML
                document.getElementById("matches_today").innerHTML = "";
                // Appending today's matches HTML to the today's matches table
                document.getElementById("matches_today").innerHTML = `
                <tr>
                    <th>Team 1</th>
                    <th>Match Status</th>
                    <th>Team 2</th>
                </tr>
                ${newTodayHTML || "<tr><td colspan='3'>No matches today!</td></tr>"}`;

                // Showing recent matches with option to show more
                const recentData = matchList.filter(match => match.series.includes(league) && match.dateTimeGMT.split('T')[0] < today);
                const newRecentHTML = recentData.map((match, index) => {
                    // Mapping data to HTML for recent matches
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

                        // Generating HTML for each recent match
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

                // Clear recent matches table before appending new HTML
                document.getElementById("matches_recent").innerHTML = "";
                // Appending recent matches HTML to the recent matches table
                document.getElementById("matches_recent").innerHTML = `
                <tr>
                    <th>Team 1</th>
                    <th>Match Result</th>
                    <th>Team 2</th>
                </tr>
                ${newRecentHTML || "<tr><td colspan='3'>No recent matches!</td></tr>"}`;

                // If there are more recent matches than displayed and the "Show More" button has not been added yet, add the button
                if (recentData.length > recentRowsDisplayed && !showRecentButtonAdded) {
                    // Append the "Show More" button before the link and center it
                    const showRecentButton = document.createElement('button');
                    showRecentButton.textContent = 'Show More';
                    showRecentButton.addEventListener('click', () => {
                        if (showRecentButton.textContent === 'Show More') {
                            showRecentButton.textContent = 'Show Less';
                            recentRowsDisplayed = recentData.length; // Show all remaining rows
                        } else {
                            showRecentButton.textContent = 'Show More';
                            recentRowsDisplayed = 2; // Reset to 2 rows
                        }
                        document.getElementById("matches_recent").innerHTML = ''; // Clear recent matches table
                        getMatchData(league); // Re-render recent matches with the correct league parameter
                    });
                    document.getElementById("recentButtonContainer").appendChild(showRecentButton);

                    showRecentButtonAdded = true; // Set the flag to indicate that the button has been added
                }

                // Filtering upcoming matches scheduled after today
                const upcomingData = matchList.filter(match => match.series.includes(league) && match.dateTimeGMT.split('T')[0] > today);
                const newUpcomingHTML = upcomingData.map((match, index) => {
                    // Mapping data to HTML for upcoming matches
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

                        // Generating HTML for each upcoming match
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

                // Clear upcoming matches table before appending new HTML
                document.getElementById("matches_upcoming").innerHTML = "";
                // Appending upcoming matches HTML to the upcoming matches table
                document.getElementById("matches_upcoming").innerHTML = `
                <tr>
                    <th>Team 1</th>
                    <th>Match Result</th>
                    <th>Team 2</th>
                </tr>
                ${newUpcomingHTML || "<tr><td colspan='3'>No upcoming matches!</td></tr>"}`;

                // If there are more upcoming matches than displayed and the "Show More" button has not been added yet, add the button
                if (upcomingData.length > upcomingRowsDisplayed && !showUpcomingButtonAdded) {
                    // Append the "Show More" button before the link and center it
                    const showUpcomingButton = document.createElement('button');
                    showUpcomingButton.textContent = 'Show More';
                    showUpcomingButton.addEventListener('click', () => {
                        if (showUpcomingButton.textContent === 'Show More') {
                            showUpcomingButton.textContent = 'Show Less';
                            upcomingRowsDisplayed = upcomingData.length; // Show all remaining rows
                        } else {
                            showUpcomingButton.textContent = 'Show More';
                            upcomingRowsDisplayed = 2; // Reset to 2 rows
                        }
                        document.getElementById("matches_upcoming").innerHTML = ''; // Clear upcoming matches table
                        getMatchData(league); // Re-render upcoming matches with the correct league parameter
                    });
                    document.getElementById("upcomingButtonContainer").appendChild(showUpcomingButton);

                    showUpcomingButtonAdded = true; // Set the flag to indicate that the button has been added
                }
            })
        );
}

const dropDown = document.getElementById('leagueDropdown')

dropDown.addEventListener('change', function() {
    getMatchData(dropDown.value);
    if(dropDown.value !== "Indian Premier League") {
        const boardElement = document.getElementById("board");
        if(boardElement) {
            boardElement.style.display = "none"; // Hide the element
        }
    } else {
        if(!document.getElementById("board")) {
            // If the element doesn't exist, create it
            const board = document.createElement("div");
            board.id = "board";
            // Add any additional content or attributes to the "board" element if needed
            document.body.appendChild(board); // Append it to the body or any other parent element
        } else {
            const boardElement = document.getElementById("board");
            boardElement.style.display = ""; // Show the element (make sure to clear the display property)
        }
    }
});

getMatchData("Indian Premier League");

var requestOptions = {
    method: 'GET'
};

var params = {
    api_token: 'OqCRN5FiOn7u363Q28hxK0e5w7jrJbvOrFoaldOc',
    categories: 'sports,entertainment',
    search: 'ipl + cricket',
    limit: '10'
};

var esc = encodeURIComponent;
var query = Object.keys(params)
    .map(function(k) {return esc(k) + '=' + esc(params[k]);})
    .join('&');

async function getNewsData() {
    // Fetching data 
    return await fetch("https://api.thenewsapi.com/v1/news/all?" + query, requestOptions)
        .then(response => response.json())
        .then(data => {

            // Select the news container
            const newsContainer = document.getElementById('news');
            console.log(data.data)

            // Loop through the fetched news data
            data.data.forEach(newsItem => {
                // Create a card element
                const card = document.createElement('div');
                card.classList.add('card');

                // Create an image element
                const image = document.createElement('img');
                image.src = newsItem.image_url;
                image.alt = newsItem.title;
                card.appendChild(image);

                // Create a title element
                const title = document.createElement('h3');
                title.textContent = newsItem.title;
                card.appendChild(title);

                // Create a link element for the source
                const sourceLink = document.createElement('a');
                sourceLink.textContent = "Go to Source";
                sourceLink.href = newsItem.url;
                card.appendChild(sourceLink);
                card.appendChild(document.createElement('br'));
                card.appendChild(document.createElement('br'));
                card.appendChild(document.createElement('br'));

                // Append the card to the news container
                newsContainer.appendChild(card);
            });
        });
}

// Call the function to fetch and display news data
getNewsData();

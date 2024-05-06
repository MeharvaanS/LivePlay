// Get the dark mode toggle switch
var darkModeSwitch = document.getElementById("darkModeToggle");

// Function to apply dark mode styles
function applyDarkMode() {
   // Remove previous style elements
   removeStyleElements();

   // Inject new dark mode CSS
   var css = 'html {-webkit-filter: invert(100%);' +
       '-moz-filter: invert(100%);' + 
       '-o-filter: invert(100%);' + 
       '-ms-filter: invert(100%); }' +
       'img { -webkit-filter: invert(100%); filter: invert(100%); }', // Exclude images from color inversion
   style = document.createElement('style');
   
   style.type = 'text/css';
   if (style.styleSheet){
       style.styleSheet.cssText = css;
   } else {
       style.appendChild(document.createTextNode(css));
   }
   
   // Inject the CSS to the head
   document.getElementsByTagName('head')[0].appendChild(style);
    localStorage.setItem('darkMode', 'enabled');
}

// Function to remove dark mode styles
function removeDarkMode() {
     // Remove previous style elements
     removeStyleElements();

     // Inject new light mode CSS
     var css ='html {-webkit-filter: invert(0%); -moz-filter: invert(0%); -o-filter: invert(0%); -ms-filter: invert(0%); }' +
         'img { -webkit-filter: invert(0%); filter: invert(0%); }', // Exclude images from color inversion
     style = document.createElement('style');
 
     style.type = 'text/css';
     if (style.styleSheet){
         style.styleSheet.cssText = css;
     } else {
         style.appendChild(document.createTextNode(css));
     }
     
     // Inject the CSS to the head
     document.getElementsByTagName('head')[0].appendChild(style);
    localStorage.setItem('darkMode', 'disabled');
}

// Function to toggle dark mode
function toggleDarkMode() {
    if (darkModeSwitch.checked) {
        applyDarkMode();
    } else {
        removeDarkMode();
    }
}

// Check the dark mode preference in localStorage when the page loads
window.onload = function() {
    var darkModeEnabled = localStorage.getItem('darkMode') === 'enabled';
    // Set the initial state of the dark mode switch based on the preference in localStorage
    darkModeSwitch.checked = darkModeEnabled;
    // Apply or remove dark mode styles based on the preference in localStorage
    if (darkModeEnabled) {
        applyDarkMode();
    } else {
        removeDarkMode();
    }
};

// Add event listener to the dark mode switch
darkModeSwitch.addEventListener('change', toggleDarkMode);

function removeStyleElements() {
    var head = document.getElementsByTagName('head')[0];
    var styleElements = head.getElementsByTagName('style');

    // Remove all existing style elements
    for (var i = 0; i < styleElements.length; i++) {
        head.removeChild(styleElements[i]);
    }
}


// Bind Enter key to search functionality
var input = document.getElementById("search_query");
input.addEventListener("keypress", function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById("searchPhotos").click();
    }
});

// Reset default text in file upload field
document.getElementById("file_name").innerHTML = "Select a file to upload";

// Display file name in custom input for file
$('#uploaded_file').change(function() {
  var file = $('#uploaded_file')[0].files[0].name;
  document.getElementById("file_name").innerHTML = file;
});

// Clear images grid and reset
function clear_grid() {
  document.getElementById("photos_search_results").innerHTML = "";
  document.getElementById('search_query').value = "";
}

function close_dialog() {
  var elem = document.getElementById("dialog");
  elem.classList.add("close_dialog");
}
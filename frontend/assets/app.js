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

// Progress Bar
function pseudo_progress_bar() {
    var elem = document.getElementById("progress_bar");
    var elem_parent = document.getElementById("progress_container");
    console.log(elem, ',', elem_parent);
    elem_parent.style.display = "inline-block";
    for (let i = 0; i < 101; i++) {
        (function (i) {
            setTimeout(function () {
                elem.style.width = String(i) + "%";
            }, 10 * i);
        })(i);
    }
    setTimeout(function() {
        elem_parent.display.display = "none";
    }, 1500);
}

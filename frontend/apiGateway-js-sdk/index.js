var apigClient = apigClientFactory.newClient();
window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

function createNameId(length) {
    let result           = '';
    let characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
   return result;
}

function voiceSearch() {
    if ('SpeechRecognition' in window) {
        console.log("SpeechRecognition is Working");
    } else {
        console.log("SpeechRecognition is Not Working");
    }

    var inputSearchQuery = document.getElementById("search_query");
    const recognition = new window.SpeechRecognition();
    //recognition.continuous = true;

    micButton = document.getElementById("mic_search");

    if (micButton.innerHTML == "mic") {
        recognition.start();
    } else if (micButton.innerHTML == "mic_off"){
        recognition.stop();
    }

    recognition.addEventListener("start", function() {
        micButton.innerHTML = "mic_off";
        console.log('add class....');
        micButton.addClass("mic_anim");
        // Add class to indicate recording is going on with some
        console.log("Recording.....");
    });

    recognition.addEventListener("end", function() {
        console.log("Stopping recording.");
        micButton.removeClass("mic_anim");
        console.log('remove class....');
        micButton.innerHTML = "mic";
    });

    recognition.addEventListener("result", resultOfSpeechRecognition);
    function resultOfSpeechRecognition(event) {
        const current = event.resultIndex;
        transcript = event.results[current][0].transcript;
        inputSearchQuery.value = transcript;
        console.log("transcript : ", transcript);
        searchPhotos(transcript);
        // Add functionality for automatically calling the searchPhotos function after 2 seconds.
        // Backup to "Enter a text or say something for "
    }
}

function textSearch() {
    var searchText = document.getElementById('search_query');
    if (!searchText.value) {
        alert('Please enter a valid text or voice input!');
    } else {
        searchText = searchText.value.trim().toLowerCase();
        searchPhotos(searchText);
    }
}

function searchPhotos(searchText) {

    document.getElementById("searching_loading_image").style.display = "inline";
    document.getElementById('search_query').value = searchText;
    document.getElementById('photos_search_results').innerHTML = "<h4 style=\"text-align:center\">";
    var image_not_found = document.getElementById("no_image_found");
    image_not_found.style.display = "none";

    var params = {
        'q' : searchText
    };

    apigClient.searchGet(params, {}, {})
        .then(function(result) {

            image_paths = result["data"];

            var photosDiv = document.getElementById("photos_search_results");
            photosDiv.innerHTML = "";

            var n;
            for (n = 0; n < image_paths.length; n++) {
                images_list = image_paths[n].split('/');
                imageName = images_list[images_list.length - 1];
                photosDiv.innerHTML += `
                <figure
                class="w-full relative rounded
                border border-2 border-transparent border-solid
                hover:border hover:border-2 hover:border-white border-solid custom-shadow">
                <img src="${image_paths[n]}">
                <figcaption class="absolute text-xs -mt-8 text-white px-4 w-full py-2 backdrop-opacity-10 backdrop-invert bg-slate-900">
                    <a href="${image_paths[n]}" target="_blank">View Full Size Image</a>
                </figcaption>
                </figure>
                `;
            }
            document.getElementById("searching_loading_image").style.display = "none";
        }).catch(function(result) {
            image_not_found.style.display = "inline-block";
            image_not_found.innerHTML = `No images found for ${searchText}. Try entering another keyword like "mountain" or "sea".`
            document.getElementById("searching_loading_image").style.display = "none";
        });
}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    // reader.onload = () => resolve(reader.result)
    reader.onload = () => {
      let encoded = reader.result.replace(/^data:(.*;base64,)?/, '');
      if (encoded.length % 4 > 0) {
        encoded += '='.repeat(4 - (encoded.length % 4));
      }
      resolve(encoded);
    };
    reader.onerror = (error) => reject(error);
  });
}

function uploadPhoto() {
    document.getElementById("upload_loading_image").style.display = "inline";
    let file = document.getElementById('uploaded_file').files[0];
    if (file ==  undefined) {
        alert("No file selected. Please select an image to upload.");
        window.location.reload();
        return;
    }
    let file_name = file.name;
    let file_type = file.type
    let reader = new FileReader();
    // console.log('file name: ', file_name);
    // console.log('file type: ', file_type);
    reader.onload = function() {
        let arrayBuffer = this.result;
        let blob = new Blob([new Int8Array(arrayBuffer)], {
            type: file_type
        });
        let blobUrl = URL.createObjectURL(blob);
        let data = document.getElementById('uploaded_file').files[0];
        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                document.getElementById('success_alert').style.display = 'inline-block';
                document.getElementById('uploadText').innerHTML ='Image Uploaded';
                document.getElementById("upload_loading_image").style.display = "none";
                document.getElementById('custom_labels').value = '';
                document.getElementById("file_name").innerHTML = "Select a file to upload";
            }
        });
        // Error handling in case of an upload error
        xhr.withCredentials = false;
        // Generate random file name from function above
        let mak_str = createNameId(24);
        // Extract extension from file
        let ext = String(file_type.split('/').pop());
        // Create new file file with mak_str + '.' extension_from_file_type
        let image_name = mak_str + '.' + ext;
        // API Endpoint
        xhr.open("PUT", "https://fqgas4zyjj.execute-api.us-east-1.amazonaws.com/v1/upload/img-db-00x/" + image_name);

        // Temp endpoint for development purpose
        // xhr.open("PUT", "URL_HERE" + image_name);
        xhr.setRequestHeader("Content-Type", data.type);
        xhr.setRequestHeader("x-api-key","");
        xhr.setRequestHeader("x-amz-meta-customLabels", custom_labels.value);
        xhr.setRequestHeader("Access-Control-Allow-Origin", '*');
        xhr.send(data);
        setTimeout(function() {
            document.getElementById('success_alert').style.display = 'none';
        }, 2000)
    };
    reader.readAsArrayBuffer(file);
}

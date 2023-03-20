//makesure to include  <script src='http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js'></script>

//Example
function send_dinsaur() {
    var formData = new FormData();
    formData.append('user_content_post', "hello");
    formData.append('AI_content_post', "dinosaur&monster");
    formData.append('error_score_post', "pat");
    // Display the key/value pairs
    post_sheet(formData);

}

//Function
function post_sheet(formData) {
    console.log(serialize_form_data(formData));
    // abort any pending request
    var request;
    if (request) {
        request.abort();
    }
    var serializedData = serialize_form_data(formData)
    //console.log(serializedData);

    // let's disable the inputs for the duration of the ajax request
    // Note: we disable elements AFTER the form data has been serialized.
    // Disabled form elements will not be serialized.

    //REPLACE THIS!
    request = $.ajax({
        url: "https://script.google.com/macros/s/AKfycbyvLI3vp3lKWoJZttVk6mFhmHMC6wiM24sY6EgxMhVU_OGlgrFsfN04_xLkq7qJgtBKpg/exec",
        type: "post",
        data: serializedData
    });

    // callback handler that will be called on success
    request.done(function(response, textStatus, jqXHR) {
        // log a message to the console

    });

    // callback handler that will be called on failure
    request.fail(function(jqXHR, textStatus, errorThrown) {
        // log the error to the console
        console.error(
            "The following error occured: " +
            textStatus, errorThrown
        );
    });



}

function form_data_length(formData) {
    count = 0;
    for (var pair of formData.entries()) {
        count = count + 1;
    }
    return (count);
}

function serialize_form_data(formData) {
    var serialized_string = ""
    var length = form_data_length(formData);
    count = 0;
    for (var pair of formData.entries()) {
        var key = pair[0];
        var input_value = pair[1];
        input_value = input_value.replace('&', ' AND ');
        input_value = input_value.replace('=', ' EQUAL ');
        key = key.replace('&', ' AND ');
        key = key.replace('=', ' EQUAL ');

        //Appending to final string
        serialized_string = serialized_string + key + "=" + input_value;
        //Add add
        if (count < length - 1) {
            serialized_string = serialized_string + "&"
        }
        count = count + 1;
    }
    return (serialized_string);
}


var convo_num = 0;
var allow_to_send = 0;
var audio = 0;

//Save Variable
var qualtrics_code = "0";
var user_text;
var AI_text;


//Add user text to chat flow
function add_user_bubble(color, input_message) {
  let bubble_temp = document.getElementById("user_template");
  //clone template
  let bubble_new = bubble_temp.cloneNode(true);
  //change ID
  convo_num = convo_num + 1;
  var current_convo = "bubble_" + convo_num;
  bubble_new.id = current_convo;
  //change statement
  bubble_new.querySelector("#display_message").innerHTML = input_message;
  //insert to chatframe
  var chat_flow = document.getElementById("ChatFlow");
  //make the chat visible
  bubble_new.style.display = "flex";
  chat_flow.innerHTML = chat_flow.innerHTML + bubble_new.outerHTML;
  //scrow to view
  document.getElementById(current_convo).scrollIntoView();
}

//Add other text to chat flow
function add_other_bubble(color) {
  let bubble_temp = document.getElementById("other_template");
  //clone template
  let bubble_new = bubble_temp.cloneNode(true);
  //change ID
  convo_num = convo_num + 1;
  var current_convo = "bubble_" + convo_num;
  bubble_new.id = current_convo;
  //insert to chatframe
  var chat_flow = document.getElementById("ChatFlow");
  //make the chat visible
  bubble_new.style.display = "flex";
  chat_flow.innerHTML = chat_flow.innerHTML + bubble_new.outerHTML;
  //scrow to view
  document.getElementById(current_convo).scrollIntoView();

  return current_convo;
}

function fill_bubble(current_convo, input_message) {
  bubble_select = document.getElementById(current_convo);
  bubble_select.querySelector("#display_message").innerHTML = input_message;
  bubble_select.querySelector("#display_message").style.display = "block";
  bubble_select.querySelector("#loading_dots").style.display = "none";
  document.getElementById(current_convo).scrollIntoView();
}

//Getting Keyboard Input
function user_type() {
  user_input_text = document.getElementById("UserInput_Textarea").value;
  if (user_input_text != "") {
    add_user_bubble("#a6ffe5", user_input_text);
    console.log("User Input Text: " + user_input_text);
    call_GPT3(user_input_text)
  }
  console.log("click");
}

//When the user presses enter
document.getElementById("UserInput_Textarea").onkeypress = function(e) {
  if (!e) e = window.event;
  var keyCode = e.code || e.key;
  if (keyCode == "Enter") {
    user_type();
    document.getElementById("UserInput_Textarea").value = "";
    return false;
  }
};


//GPT3
var pre_data_obj = {
  prompt: `The following is a conversation with virtual Leonardo Da Vinci, the great scientist and artist of the Renaissance period.`,
  temperature: 0.9,
  max_tokens: 150,
  top_p: 1,
  frequency_penalty: .8,
  presence_penalty: 0.6,
  stop: ["Da Vinci:", "Q:"]
}

var qa_pairs = [];

var current_convo = "";

function call_GPT3(human_say) {

  console.log("call GPT3");
  pre_data_obj.prompt = pre_data_obj.prompt.concat(
    `Q: ${human_say}
       Da Vinci: 
      `
  );

  // URL TO API
  var url = "https://affc-18-29-15-42.ngrok.io/generate-answer"

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url);

  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("ngrok-skip-browser-warning", "true");

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log(xhr.responseText);

      var GPT3_text = xhr.responseText;

      if (GPT3_text != null && GPT3_text != '') {
        fill_bubble(current_convo, GPT3_text);
        save_conversation(human_say, GPT3_text);
        qa_pairs.push([human_say, GPT3_text]);
        console.log(qa_pairs);
      }

    }
  };

  xhr.send(JSON.stringify({ "question": human_say, "qa_pairs": qa_pairs.splice(-10) }));
  setTimeout(function() {
    current_convo = add_other_bubble("#a6deff");
  }, 1000);
}

function trimPrompt(txt) {
  txt_array = txt.split(" ");
  if (txt_array.length > 1000) {
    console.log("trimming Prompt");
    prompt_start = txt_array.splice(0, 141).join(' ');
    prompt_end = txt_array.splice(-200).join(' ');
    return prompt_start + prompt_end
  }
  else {
    return txt
  }

}


function save_conversation(human_say, GPT3_text) {
  var formData = new FormData();

  formData.append('qualtrics_code', qualtrics_code);
  formData.append('user_text', human_say);
  formData.append('AI_text', GPT3_text);


  // Display the key/value pairs
  post_sheet(formData);
}
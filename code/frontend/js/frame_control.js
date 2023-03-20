function play_video() {
  document.getElementById("next_button").style.visibility = "hidden";
  var vid = document.getElementById("davinci_intro");
  vid.muted = false;
  vid.play();

  vid.onended = function(e) {
    console.log("END!!!");


  document.getElementById("section_intro").style.display = "none";
  document.getElementById("section_chat_UI").style.display = "block";
  setTimeout(function() {
    current_convo = add_other_bubble("#a6deff");
    fill_bubble(current_convo, "Hi again, what do you want to know about me? You can ask me about my life, my work, my legacy, or anything else that might satisfy your curiosity.");
  }, 1000);
  };
}


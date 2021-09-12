
var item = null;
var itemComponents =[];
let componentsToFill=[];
let hasRecipe = false;
var score=0;
var combo=0;
var guesses=3;
var animated = document.querySelector('.animated');

start();

function requestItem(){


  $.ajax({
 
  dataType: "json",
  url: "https://dota2-quiz.herokuapp.com/randomItem",
  success: function(result){
   
   item = result;

   itemComponents = result.components.slice();
    // stuff to do after request

   setupGame();
   
  }
});


}

function start(){
    
    $("#guesses").html("Guesses Left: " + guesses);
    $("#score").html("Score: " + score); 
    $("#combo").html(combo + " in a row");

    requestItem();
   
}

// make asynchronous server requests first to optimize time
function setupGame(){
    adjustComponents();
    getRemainingComponents();
}



function showGame(){
 
$("#spinner").remove();
  // wait for animation to end before displaying next round, if animation has already passed before it reaches this line, just continue.      
  // animation already done
    if ($("#message").length == 0 || animated == null){
        $("#itemsContainer").empty();
        loadImages();
        loadClickable();
     } 
     else{
        animated.addEventListener('animationend', () => {
        $("#itemsContainer").empty();
        loadImages();
        loadClickable();
    });
     }
}

function nextRound(outcome){
    var messages=[];

    if (outcome == true){
        score += 200 + 30 * combo;
        combo++;
    }
    else if (outcome == false){
        guesses--;
        combo=0;
        // messages if incorrect
        messages= ["Oops", "Incorrect", "False", "Sorry", "Uh uh", "Nope"];
        
    }
        $("#guesses").html("Guesses Left: " + guesses);
        $("#score").html("Score: " + score); 
        $("#combo").html(combo + " in a row");

       
        $("#combo").css("color", "white");
        $("#combo").css("font-size", 12);

        
   

        if (combo == 1){
             $("#combo").css("color", "white");
            $("#combo").css("font-size", 12);
            messages = ["Correct!"];  
        }


        else if (combo == 2 || combo == 3){
             $("#combo").css("color", "yellow");
              $("#combo").css("font-size", 16);
              messages = ["Well Done!", "Dominating!"];
        }

        else if (combo == 4 || combo == 5){
            $("#combo").css("color", "rgb(185,165,44)");
               $("#combo").css("font-size", 16);
            messages = [ "Dominating!", "Unstoppable!", "Mega Answer!", "Answering Spree!"];
        }               


        else if (combo == 6 || combo == 7){
            $("#combo").css("color", "orange");
            $("#combo").css("font-size", 22);
            messages =["Wicked Sick", "Monster Answer!", "Godlike!"];
        }

        else if (combo >= 8){
            $("#combo").css("font-size", 26);
             $("#combo").css("color", "red");
             messages = ["Beyond Godlike!"]
        
        }
        var randMessage =  messages[Math.floor(Math.random()*messages.length)];
        displayMessage(outcome, randMessage);
       
        if (guesses == 0){

            displayEndScreen();
        }
        else if (outcome == true){
            item = requestItem();

        }
    } 


function adjustComponents(){

    // if item array has recipe, remove it
    if (itemComponents[itemComponents.length-1].name.includes("Recipe")){
         itemComponents.splice(itemComponents.length-1, 1);

         hasRecipe = true;
    }else{
        hasRecipe = false;
    }

}


function loadClickable(){

    $("img").click(function() {
        // select item to 2nd row animation 
        if (this.className == "thirdRow" && this.getAttribute("active") != "false"){

            var secRow = $(".secRow");
            for (let obj of secRow) {

                // space is available in 2nd row
                if (obj.getAttribute("src") == "question_mark.png" && obj.getAttribute("name") == "empty"){
                    // instantly set name, solves async issues, i.e bug when clicking 2 items in quick succession
                    this.setAttribute("name", this.name);
                    let placeToMove = $(obj).position();
            
                     
                    var lel = $(this).clone();
                    lel.appendTo($(this).parent());
                    this.style.opacity = "0.2";   
                     $(lel).animate({top: placeToMove.top + "px", left: placeToMove.left + "px"},{
                        duration:200,

                        complete:function(){
                             
                             $(lel).remove();
                             obj.src = this.src;
                        }
                    });
                     
                    $(this).attr("active", false);               
                   
                  

                    // copy item attributes to question_mark div
                  
                    obj.name = this.name;
                    obj.setAttribute("order",this.getAttribute("order"));
                    let tooltip = $(this).siblings(".tooltip");
                    tooltip.css("top", obj.style.top);
                    tooltip.css("left", obj.style.left);

                    $(obj).parent().append(tooltip);
                  
                    
                    // row is full of items
                    if ($(".secRow[name='empty']").length == 0){
                        evaluate();
                    }
                    return;


                   
                }

            }
            

            
        }
        // remove item animation
        if (this.className == "secRow" && this.getAttribute("name") != "empty"){
            
            var pic = this.src;

            // return item image back to where it belonged
            var thirdRow = $(".thirdRow");

            for (let obj of thirdRow) {
                if (obj.getAttribute("order") == this.getAttribute("order")){
                     $(this).attr("name", "empty");

                    let placeToMove = $(obj).position();  
                    this.src = "question_mark.png";  
                    var lel = $(this).clone();
                   
                    lel.appendTo($(this).parent());


                    $(lel).animate({top: placeToMove.top + "px", left: placeToMove.left + "px"},{
                        duration:200,
                        start:function(){
                           lel.attr("src", pic);
                           
                        },
                        complete:function(){
                          obj.style.opacity ="1";
                           let tooltip = $(this).siblings('.tooltip');
                            tooltip.css("top", obj.style.top);
                            tooltip.css("left", obj.style.left);

                     
                         $(obj).parent().append(tooltip);
                         
                          $(lel).remove();
                          obj.setAttribute("active", true);
                        }
                    });

            
               
                   
                  
                }
            }

        }

        
    });
    }



    function evaluate(){
        var result1;
        var answers = [];
        var secRow = $(".secRow");


        for (let obj of secRow) {
            answers.push(obj.name);

        }
     

        $.ajax({
          type: "POST",
          url: "https://dota2-quiz.herokuapp.com/checkItem?itemName=" + item.name,
          data: JSON.stringify(answers),
          dataType: "json",
          headers: {
            'Content-Type':'application/json'
            },
          success: function(outcome){
              nextRound(outcome);

          }
     
      });


}


function getRemainingComponents(){
   
  $.ajax({
      type: "POST",
      url: "https://dota2-quiz.herokuapp.com/randomComponents?amount=" +  (8-itemComponents.length),
      data: JSON.stringify(item),
      dataType: "json",
      headers: {
        'Content-Type':'application/json'
        },
     
      success: function(result){
            componentsToFill = result;
            showGame();
    
      }
 
  });

}


function shuffleArray(array){

      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;

    }
    return array;

}




function loadImages(){

    // first row
    create_img(item, 303,56, "firstRow");
    let emptyItem = {icon: "question_mark.png", name:"empty"};
    // second row
    let length=itemComponents.length;

    if (hasRecipe == true){
        length = length+1;
    }

    switch (length){

        
        case 1:
             create_img(emptyItem,303, 116, "secRow");
             break;
            
            
        case 2:
             create_img(emptyItem,274, 116,"secRow");
             create_img(emptyItem,333, 116,"secRow");
             break;

        case 3:

            create_img(emptyItem,246, 116,"secRow");
            create_img(emptyItem,303, 116,"secRow");
            create_img(emptyItem,360, 116,"secRow");
            break;


        case 4:
            create_img(emptyItem,214, 116,"secRow");
            create_img(emptyItem,273, 116,"secRow");
            create_img(emptyItem,332, 116,"secRow");
            create_img(emptyItem,390, 116,"secRow");
            break;

        case 5:
            create_img(emptyItem,188, 116,"secRow");
            create_img(emptyItem,246, 116,"secRow");
            create_img(emptyItem,302, 116,"secRow");
            create_img(emptyItem,362, 116,"secRow");
            create_img(emptyItem,420, 116,"secRow");
            break;

        default:
            console.log("component length error1");

    }
   
    var components = itemComponents;

    // append array onto components
    components.push.apply(components, componentsToFill);
    shuffleArray(components);


    // 3rd row
    // assign order to know where to put the images back (if duplicates)
    create_img(components[0], 72, 177,"thirdRow").setAttribute("order", 1);
    create_img(components[1], 130,177,"thirdRow").setAttribute("order", 2);
    create_img(components[2], 188, 177,"thirdRow").setAttribute("order", 3);
    create_img(components[3], 246, 177,"thirdRow").setAttribute("order", 4);
    create_img(components[4], 302, 177,"thirdRow").setAttribute("order", 5);
    create_img(components[5], 362, 177,"thirdRow").setAttribute("order", 6);
    create_img(components[6], 420, 177,"thirdRow").setAttribute("order", 7);
    create_img(components[7], 478, 177,"thirdRow").setAttribute("order", 8);


    create_img({icon:"Default_recipe_icon.png", name:"Recipe"}, 550,177,"thirdRow").setAttribute("order", 9);

    }



function createToolTip(item){


    var tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
    

    var bottom = document.createElement("div");
    bottom.classList.add("bottom");
    var h3 = document.createElement("h3");
    h3.innerHTML = item.name;
    h3.setAttribute("style","color:white; margin-bottom:5px; text-align:left;");
    bottom.appendChild(h3);

    var stats = $(item).attr("stats");

    // check if stats exists or is empty
    // item.stats[0] !== ""
    if ( typeof stats !== 'undefined' && stats !== false) {
        if(item.stats[0] !== ""){
        var ul = document.createElement("ul");
        ul.setAttribute("style", "list-style-type:none; padding-left:0; margin-bottom:0");

        for (let i=0; i<item.stats.length; i++){
           $(ul).append("<li>"+ item.stats[i] +"</li>");
        }
          bottom.appendChild(ul);
        }
        else{
            $(bottom).find("h3").attr("style", "color:white; margin-bottom:0px; text-align:left;");
        }
    }
    

    // arrow of tooltip
    $(bottom).append("<i></i>");
    tooltip.appendChild(bottom);

    return tooltip;

  
}





function create_img(item, xpos, ypos, className){
    var itemDiv = document.createElement("div");
    itemDiv.classList.add("item");
    var img = new Image();
   
    

    img.style.left = xpos + 'px';
    img.style.top = ypos + 'px' ;


    img.className = className;
    img.setAttribute("active", true);

    img.name = item.name;
    img.src = item.icon;
    // display none so jquery animation plays when shown
    img.style.display = "none";
   


    if (className != "secRow"){

         var tooltip = createToolTip(item);
         tooltip.style.left = xpos + 'px';
         tooltip.style.top = ypos + 'px' ;
         itemDiv.appendChild(tooltip);
    }
    itemDiv.appendChild(img);
    document.getElementById('itemsContainer').appendChild(itemDiv);
    $(img).slideDown();
    return img;
}

    
function displayMessage(outcome, randMessage){

  
    var message = document.createElement("div");
    message.id = "message";
    message.innerHTML= randMessage;
 
    if (outcome == true){
        var scoreText = document.createElement("p");
        scoreText.style.color = "rgb(255,200,21)";
        message.style.color = "rgb(255,200,21)";
        
        scoreText.innerHTML = "+" + (200 + 30 * (combo-1));
        message.appendChild(scoreText);

    }
    else{
        message.style.color = "red";
    }

   
    $(message).addClass("animated");
    document.getElementById("game").appendChild(message);   

     animated = document.querySelector('.animated');
    animated.addEventListener('animationend', () => {
        $(message).remove();
        
    });



}

function displayEndScreen(){

 var correctRow = $(".secRow").clone();

     // show correct items
     for (let i=0; i<correctRow.length; i++){
        $($(correctRow)[i]).attr("src", item.components[i].icon);
        $($(correctRow)[i]).attr("name", item.components[i].name);
    }

    $(correctRow).hide();

    $("#mainContent").append(correctRow);
    $(correctRow).show("bounce",2000);


    var end = document.createElement("div");
    //center 
    end.style.position = "absolute";
    end.style.marginLeft = "auto";
    end.style.marginRight = "auto";
    end.style.left = "0";
    end.style.right = "0";
    end.id = "endDiv";
 
    end.style.width = "340px";
    end.style.height = "105px";
    end.style.background = "rgb(41,45,48)";
    end.style.color = "white";
    end.style.border = "2px solid rgb(135,58,45)";

    document.getElementById("game").setAttribute("style", "filter:brightness(0.5)");
    

    var paragraph = document.createElement("p");
    paragraph.style.top="20px";
    paragraph.style.position = "relative";
    paragraph.innerHTML= "Final Score: " + score;


    var button = document.createElement("BUTTON");
   
    button.innerHTML ="OK"; 
   
    button.onclick = function(){
        $("#endDiv").remove();
        document.getElementById("game").setAttribute("style", "filter:brightness(1)");
        guesses=3;
        combo=0;
        score=0;
     
        $(correctRow).remove();
        animated = null;
        start();
      
       

    }

    end.appendChild(button);
    end.appendChild(paragraph);
    $(end).animate({bottom: '93px' });
    document.getElementById("mainContent").appendChild(end);

    }






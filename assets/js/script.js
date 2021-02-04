var spoonacularAPIKey ='8f3601ecf03246c9b4fa1b4a254023c5';
var proxy = "https://chriscastle.com/proxy/index.php?:proxy:"

//function for initial recipe list
function getRecipeList(searchTerm,excludedTerm,cookTime){

    //format the cook time request per specific API call, only if cook time is specified
    var spoonacularReadyTime ="";
    var excludedSearch=""
    if(excludedTerm){
        excludedSearch ="&excludeIngredients="+excludedTerm
    }

    if (cookTime){
        spoonacularReadyTime="&maxReadyTime="+cookTime;
    }

    var spoonacularQueryURL = "https://api.spoonacular.com/recipes/complexSearch?includeIngredients="+searchTerm+excludedSearch+"&includeNutrition=true&instructionsRequired=true"+spoonacularReadyTime+"&apiKey="+spoonacularAPIKey

    console.log(spoonacularQueryURL);//DEBUG

    $.ajax({
        method:'GET',
        url:spoonacularQueryURL
    }).then(function(data){
        console.log(data)//DEBUG

        var recipeRow = $("<div class=row>");
        data.results.forEach(result =>{
            console.log(result.title);//DEBUG
            // result.title //Name of the recipe
            // result.image;//contains full url for image.

            var recipeCol = $("<div class='col-sm img-box' data-recipe-id="+result.id+">")
            var image = $("<img class='img-img'>")
            var title = $("<div draggable='true' ondragstart='dragStart(event)' id="+result.id +" class='dragme'>");

            image.attr("src",result.image);
            title.text(result.title);

            recipeCol.append(image,title);
            recipeRow.append(recipeCol);
            
        })
        $("#main-recipe").append(recipeRow);
    })
}

//function to grab information for specific recipe
function getRecipe(recipeID){

    recipeURL = "https://api.spoonacular.com/recipes/"+recipeID+"/information?includeNutrition=true&apiKey="+spoonacularAPIKey;

    $.ajax({
        method:'GET',
        url:recipeURL
    }).then(function(data){
        console.log(data) //DEBUG
        
        parseRecipe(data);
        parseNutrition(data.nutrition);
    })
}

function parseRecipe(recipeStruct){
    var title = recipeStruct.title //name of recipe
    var imageURL = recipeStruct.image //image for the recipe
    var serves = recipeStruct.servings //servings!
    var instructionHTML = recipeStruct.instructions //the instructions. already has html
    var readyTime = recipeStruct.readyInMinutes //prep+cook time
    var cost = recipeStruct.pricePerServing //????

    var source = recipeStruct.sourceName //source of recipe
    var sourceLink = recipeStruct.sourceUrl //original recipe


    var $titleEl = $("<h1>").text(title);
    var $ingredientTitle = $("<h3 class='recipe-header'>").text("Ingredients");
    var $instructionTitle = $("<h3 class='recipe-header'>").text("Cooking Instructions");
    
    var $instructionsCol = $("<div class='col-md-12'>").html(instructionHTML);
    var $instructionsEl = $("<div class='row' id='instruction-row'>").append($instructionsCol);
    
    $("#main-recipe").empty();

    $ingredientEl = parseIngredients(recipeStruct.extendedIngredients);

    $("#main-recipe").append($titleEl,$ingredientTitle,$ingredientEl,$instructionTitle,$instructionsEl);
}

function parseNutrition(nutritionStruct){
    console.log(nutritionStruct);//DEBUG
}

function parseIngredients(ingredientStruct){
    var newRow = $("<div class='row' id='ingredient-row'>");
    var col1 = $("<div class='col-md-6'>");
    var col2 = $("<div class='col-md-6'>");

    for(var i=0; i<ingredientStruct.length;i++){
        
        var name = ingredientStruct[i].name
        var ammount = ingredientStruct[i].amount
        var unit = ingredientStruct[i].unit
        var ingredientListing = ingredientStruct[i].original; //this is the string you usually see in recipes
        console.log(ingredientListing); //DEBUG

        var ingredientEl = $("<p>").text(ingredientListing);
        if(i<ingredientStruct.length/2){
            col1.append(ingredientEl);
        }else{
            col2.append(ingredientEl);
        }
    }

    newRow.append(col1,col2);
    return(newRow)
}

//Functions for favorites menu
function dragStart(event) {
    event.dataTransfer.setData("text",event.target.textContent);
    event.dataTransfer.setData("id", event.target.id)
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();

    var incomingId = event.dataTransfer.getData("id");
    var incomingTitle = event.dataTransfer.getData("text");
    var recipeEl = document.createElement("div")
    
    recipeEl.setAttribute("data-recipe-id",incomingId);
    recipeEl.setAttribute("class","favorite-recipe");
    recipeEl.textContent=incomingTitle;

    event.target.appendChild(recipeEl);
    storeFavorites(incomingTitle,incomingId);
}

function storeFavorites(title,id){
    var recipeObj = {
        "title":title,
        "id":id
    }

    var favorites;
    if(localStorage.getItem("favoriteRecipes")){
        favorites = JSON.parse(localStorage.getItem("favoriteRecipes"));
    }else{
        favorites=[];
    }

    favorites.push(recipeObj);
    localStorage.setItem("favoriteRecipes",JSON.stringify(favorites));
}

function getFavorties(){
    if(localStorage.getItem("favoriteRecipes")){
        var favorites = JSON.parse(localStorage.getItem("favoriteRecipes"));
        
        favorites.forEach(recipe =>{
            var incomingId = recipe.id;
            var incomingTitle = recipe.title;
            var recipeEl = document.createElement("div")
            
            recipeEl.setAttribute("data-recipe-id",incomingId);
            recipeEl.setAttribute("class","favorite-recipe");
            recipeEl.textContent=incomingTitle;
            document.querySelector("#cook-book-card").appendChild(recipeEl);
        })
    }
}

function clearFavorites(){
    $("#cook-book-card").empty();
    localStorage.removeItem("favoriteRecipes");
}


$("#searchButton").on("click",function(){
    getRecipeList($("#included-ingredients").val(),$("#excluded-ingredients").val(),$("#cook-time").val());    
    $("#main-recipe").empty();
    
})

$(window).on("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        $("#searchButton").click();
    }
})

$("#main-recipe").on("click",".img-box",function(){
    console.log("clicked")
    getRecipe($(this).data("recipe-id"));
})

$("#cook-book").on("click",".favorite-recipe",function(){
    console.log("clicked")
    getRecipe($(this).data("recipe-id"));
})

$("#heart").on("click",clearFavorites)

//load the stored favorite recipes on page load
getFavorties();
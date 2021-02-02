
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
            var title = $("<div draggable='true' id='draggable' onDragStart='drag(event)'>")
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
        parseIngredients(data.extendedIngredients);
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


    $("#main-recipe").empty();
    $("#main-recipe").append($titleEl,instructionHTML);
}

function parseNutrition(nutritionStruct){
    console.log(nutritionStruct);//DEBUG
}

function parseIngredients(ingredientStruct){



    ingredientStruct.forEach(element => {
        var name = element.name
        var ammount = element.amount
        var unit = element.unit
        var ingredientListing = element.original; //this is the string you usually see in recipes
        console.log(ingredientListing); //DEBUG
    });

}

$("#searchButton").on("click",function(){
    getRecipeList($("#included-ingredients").val(),$("#excluded-ingredients").val(),$("#cook-time").val());    
    $("#main-recipe").empty();
})


$("#main-recipe").on("click",".img-box",function(){
    console.log("clicked")
    getRecipe($(this).data("recipe-id"));
})

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}







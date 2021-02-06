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

            var recipeCol = $("<div class='col-sm img-box' data-recipe-id="+result.id+" draggable='true' ondragstart='dragStart(event)'>")
            var image = $("<img draggable='false' class='img-img'>")
            var title = $("<div>");

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

    //servings
    var $serving = nutritionStruct.weightPerServing.amount
    $("#serving").empty();
    $("#serving").append($serving + "g")
    
    //calories
    var $calories = nutritionStruct.nutrients[0].amount 
    $("#calories").empty();
    $("#calories").append($calories)

    //calories from fat
    var $percentFat = nutritionStruct.caloricBreakdown.percentFat 
    $("#percentFat").empty();
    $("#percentFat").append($percentFat + "%")

    //total fat
    var $totalFat = nutritionStruct.nutrients[1].amount 
    $("#totalFat").empty();
    $("#totalFat").append($totalFat + "g")
    var $totalFatDV = nutritionStruct.nutrients[1].percentOfDailyNeeds 
    $("#totalFatDV").empty();
    $("#totalFatDV").append($totalFatDV + "%")

    //saturated fat
    var $saturatedFat = nutritionStruct.nutrients[2].amount 
    $("#saturatedFat").empty();
    $("#saturatedFat").append($saturatedFat + "g")
    var $saturatedFatDV = nutritionStruct.nutrients[2].percentOfDailyNeeds 
    $("#saturatedFatDV").empty();
    $("#saturatedFatDV").append($saturatedFatDV + "%")

    //trans fat
    
    //cholesterol
    var $cholesterol = nutritionStruct.nutrients[6].amount 
    $("#cholesterol").empty();
    $("#cholesterol").append($cholesterol + "mg")
    var $cholesterolDV = nutritionStruct.nutrients[6].percentOfDailyNeeds 
    $("#cholesterolDV").empty();
    $("#cholesterolDV").append($cholesterolDV + "%")

    //sodium
    var $sodium = nutritionStruct.nutrients[7].amount 
    $("#sodium").empty();
    $("#sodium").append($sodium + "mg")
    var $sodiumDV = nutritionStruct.nutrients[7].percentOfDailyNeeds 
    $("#sodiumDV").empty();
    $("#sodiumDV").append($sodiumDV + "%")

    //total carb
    var $totalCarb = nutritionStruct.nutrients[3].amount 
    $("#totalCarb").empty();
    $("#totalCarb").append($totalCarb + "g")
    var $sodiumDV = nutritionStruct.nutrients[3].percentOfDailyNeeds 
    $("#totalCarbDV").empty();
    $("#totalCarbDV").append($sodiumDV + "%")

    //fiber
    var $fiber = nutritionStruct.nutrients[28].amount 
    $("#fiber").empty();
    $("#fiber").append($fiber + "g")
    var $fiberDV = nutritionStruct.nutrients[28].percentOfDailyNeeds 
    $("#fiberDV").empty();
    $("#fiberDV").append($fiberDV + "%")

    //sugar
    var $sugar = nutritionStruct.nutrients[5].amount 
    $("#sugar").empty();
    $("#sugar").append($sugar + "g")
  
    //protein
    var $protein = nutritionStruct.nutrients[8].amount 
    $("#protein").empty();
    $("#protein").append($protein + "g")

    //8-10 micronutrients
    var $vitaminA = nutritionStruct.nutrients[29].percentOfDailyNeeds 
    $("#vitaminA").empty();
    $("#vitaminA").append($vitaminA + "%")

    var $vitaminB12 = nutritionStruct.nutrients[13].percentOfDailyNeeds 
    $("#vitaminB12").empty();
    $("#vitaminB12").append($vitaminB12 + "%")

    var $calcium = nutritionStruct.nutrients[27].percentOfDailyNeeds 
    $("#calcium").empty();
    $("#calcium").append($calcium + "%")

    var $iron = nutritionStruct.nutrients[16].percentOfDailyNeeds 
    $("#iron").empty();
    $("#iron").append($iron + "%")

    var $vitaminC = nutritionStruct.nutrients[23].percentOfDailyNeeds 
    $("#vitaminC").empty();
    $("#vitaminC").append($vitaminC + "%")

    var $potassium = nutritionStruct.nutrients[18].percentOfDailyNeeds 
    $("#potassium").empty();
    $("#potassium").append($potassium + "%")

    var $vitaminD = nutritionStruct.nutrients[30].percentOfDailyNeeds 
    $("#vitaminD").empty();
    $("#vitaminD").append($vitaminD + "%")

    var $folate = nutritionStruct.nutrients[29].percentOfDailyNeeds 
    $("#folate").empty();
    $("#folate").append($folate + "%")

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
    var group = event.target;
    console.log(group);
    event.dataTransfer.setData("text",group.children[1].textContent);
    event.dataTransfer.setData("id", group.getAttribute("data-recipe-id"))
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
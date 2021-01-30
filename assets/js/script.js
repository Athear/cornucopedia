
var edamamAPIid = '556477a6';
var edamamAPIKey = '3bad439961e3fa77b543342040638031';
var spoonacularAPIKey ='8f3601ecf03246c9b4fa1b4a254023c5';

var searchTerm = $("#searchButton").val().trim();
var proxy = "https://chriscastle.com/proxy/index.php?:proxy:"
var edamamQueryURL = "https://api.edamam.com/search?q="+searchTerm+"&app_id="+edamamAPIid+"&app_key="+edamamAPIKey+"&from=0&to=5"
var spoonacularQueryURL = "https://api.spoonacular.com/recipes/complexSearch?q="+searchTerm+"&includeNutrition=true&instructionsRequired=true&apiKey="+spoonacularAPIKey

//https://api.spoonacular.com/recipes/716429/information?apiKey=8f3601ecf03246c9b4fa1b4a254023c5&includeNutrition=true

function getRecipeList(searchTerm,cookTime){

    var proxy = "https://chriscastle.com/proxy/index.php?:proxy:"
    var edamamQueryURL = "https://api.edamam.com/search?q="+searchTerm+"&app_id="+edamamAPIid+"&app_key="+edamamAPIKey+"&from=0&to=5"
    var spoonacularQueryURL = "https://api.spoonacular.com/recipes/complexSearch?q="+searchTerm+"&includeNutrition=true&instructionsRequired=true&apiKey="+spoonacularAPIKey

    // initial serach for recipe list
    $.ajax({
        method:'GET',
        url:spoonacularQueryURL
    }).then(function(data){
        console.log(data)
        // console.log(JSON.parse(data));

       
    })
}

function parseRecipe(recipeID){

    recipeURL = "https://api.spoonacular.com/recipes/"+recipeID+"/information?includeNutrition=true&apiKey="+spoonacularAPIKey;

    $.ajax({
        method:'GET',
        url:recipeURL
    }).then(function(data){
        console.log(data)
        
        parseNutrition(data.nutrition)
        parseIngredients(data.extendedIngredients)
    })

}

function parseNutrition(nutritionStruct){
    console.log(nutritionStruct);
}

function parseIngredients(ingredientStruct){
    ingredientStruct.forEach(element => {
        var name = element.name
        var ammount = element.amount
        var unit = element.unit
        var ingredientListing = element.original; //this is the string you usually see in recipes
        console.log(ingredientListing);
    });

}

$("#searchButton").on("click",function(){
    cookTime = $("#cook-time").val()=="" ? "" : $("#cook-time").val()

    getRecipeList($("#ingredient-filter").val(),cookTime);   
    console.log("test");
    console.log(spoonacularQueryURL);

    $(".card-title").empty();
    $(".line").empty();
    $(".vitamins").empty();

    $("#main-recipe").html("populate clickable recipes here");


      
})





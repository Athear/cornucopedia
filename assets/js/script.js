
var edamamAPIid = '556477a6';
var edamamAPIKey = '3bad439961e3fa77b543342040638031';
var spoonacularAPIKey ='8f3601ecf03246c9b4fa1b4a254023c5';
var proxy = "https://chriscastle.com/proxy/index.php?:proxy:"

//function for initial recipe list
function getRecipeList(searchTerm,cookTime){

//format the cook time request per specific API call, only if cook time is specified
var spoonacularReadyTime ="";
var edamamReadyTime ="";
    if (cookTime){
        spoonacularReadyTime="&maxReadyTime="+cookTime;
    }

    var proxy = "https://chriscastle.com/proxy/index.php?:proxy:"
    var edamamQueryURL = "https://api.edamam.com/search?q="+searchTerm+"&app_id="+edamamAPIid+"&app_key="+edamamAPIKey+"&from=0&to=5"
    var spoonacularQueryURL = "https://api.spoonacular.com/recipes/complexSearch?q="+searchTerm+"&includeNutrition=true&instructionsRequired=true"+spoonacularReadyTime+"&apiKey="+spoonacularAPIKey

    console.log(spoonacularQueryURL);//DEBUG

    $.ajax({
        method:'GET',
        url:spoonacularQueryURL
    }).then(function(data){
        console.log(data)//DEBUG
        data.results.forEach(result =>{
            console.log(result.title);//DEBUG
            // result.title //Name of the recipe
            // result.image;//contains full url for image.
            
        })
    })
}

//function to grab information for specific recipe
function parseRecipe(recipeID){

    recipeURL = "https://api.spoonacular.com/recipes/"+recipeID+"/information?includeNutrition=true&apiKey="+spoonacularAPIKey;

    $.ajax({
        method:'GET',
        url:recipeURL
    }).then(function(data){
        console.log(data) //DEBUG
        
        parseNutrition(data.nutrition)
        parseIngredients(data.extendedIngredients)
    })

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
        console.log(ingredientListing);
    });

}

$("#searchButton").on("click",function(){

    getRecipeList($("#ingredient-filter").val(),$("#cook-time").val());   

    $(".card-title").empty();
    $(".line").empty();
    $(".vitamins").empty();

    $("#main-recipe").html("populate clickable recipes here");
      
})





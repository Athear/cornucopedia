
var edamamAPIid = '556477a6';
var edamamAPIKey = '3bad439961e3fa77b543342040638031';

function getRecipieList(searchTerm,cookTime){

    var proxy = "https://chriscastle.com/proxy/index.php?:proxy:"
    var queryURL = "https://api.edamam.com/search?q="+searchTerm+"&app_id="+edamamAPIid+"&app_key="+edamamAPIKey+"&from=0&to=5"

    $.ajax({
        method:'GET',
        url:proxy+queryURL
    }).then(function(data){
        // console.log(data)
        console.log(JSON.parse(data));
    })
}


$("#searchButton").on("click",function(){
    cookTime = $("#cook-time").val()=="" ? "" : $("#cook-time").val()

    getRecipieList($("#ingredient-filter").val(),cookTime);   

})
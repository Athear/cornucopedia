
var edamamAPIid = '556477a6';
var edamamAPIKey = '3bad439961e3fa77b543342040638031';

function getRecipieList(searchTerm,cookTime){

    var queryURL = "https://chriscastle.com/proxy/index.php?:proxy:https://api.edamam.com/search?q="+searchTerm+"&app_id="+edamamAPIid+"&app_key="+edamamAPIKey+"&from=0&to=5"

    $.ajax({
        method:'GET',
        url:queryURL
    }).then(function(data){
        console.log(JSON.parse(data));
    })
}

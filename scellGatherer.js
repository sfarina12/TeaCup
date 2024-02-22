$(document).ready(function(){
    $.ajax({url: "https://dungeonsanddragons.fandom.com/it/wiki/Incantesimi_del_Mago", 
        success: function(result){
        console.log(result)
    }});
})
var dnd_class = "wizard";
$(document).ready(function(){

  $.ajax({
    url: "https://www.dnd5eapi.co/api/classes/"+dnd_class+"/spells", 
    success: function(result){
      result.results.forEach(function(k,v) {
        $.ajax({
          url: "https://www.dnd5eapi.co/api/spells/"+k.index, 
          success: function(result){
              icon = "https://www.dndbeyond.com/content/1-0-2639-0/skins/waterdeep/images/spell-schools/35/"+result.school.index+".png"
              
              $("#lista").append(
                '<div class="l-elem">'+
                    '<img width="48" height="48" style="border-radius: 50px;margin-right: 14px;" src="'+icon+'"/>'+
                    '<div class="right">'+
                        '<text style="vertical-align: top; font-weight: 700;">'+k.name+'</text>'+
                        '<text style="width: 190px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">'+result.desc+'</text>'+
                    '</div>'+
                '</div>'
              )
          }
        });
      })
    }});

});



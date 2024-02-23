var dnd_class = "wizard";
var spell_types = []
var spell_list = []

$(document).ready(function(){
  $.ajax({
    url: "https://www.dnd5eapi.co/api/classes/"+dnd_class+"/spells", 
    success: function(result){
      
      spell_types.push("All")
      $("#spell_types_list").append("<li>All</li>")

      result.results.forEach(function(k,v) {
        $.ajax({
          url: "https://www.dnd5eapi.co/api/spells/"+k.index, 
          success: function(result){
              type = result.school.name
              if(!spell_types.includes(type)) {
                spell_types.push(type)
                $("#spell_types_list").append("<li>"+type+"</li>")
              }

              icon = "https://www.dndbeyond.com/content/1-0-2639-0/skins/waterdeep/images/spell-schools/35/"+result.school.index+".png"
              spell_list.push(result)

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

var open_bottom = false;
$("body").on('click', '#expandFilter', function() {
  openclose_filter();
})

$("body").on('click', '#spell_types_list li', function() {
  filtered_type = $(this).html()
  $("#lista").empty()
  $("#act_filter").html(filtered_type)
  openclose_filter();
  spell_list.forEach(function(k,v) {
    if((k.school.name == filtered_type) || (filtered_type == "All")) {
      icon = "https://www.dndbeyond.com/content/1-0-2639-0/skins/waterdeep/images/spell-schools/35/"+k.school.index+".png"
      $("#lista").append(
        '<div class="l-elem">'+
            '<img width="48" height="48" style="border-radius: 50px;margin-right: 14px;" src="'+icon+'"/>'+
            '<div class="right">'+
                '<text style="vertical-align: top; font-weight: 700;">'+k.name+'</text>'+
                '<text style="width: 190px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">'+k.desc+'</text>'+
            '</div>'+
        '</div>'
      )
    }
  })
})

function openclose_filter() {
  if(!open_bottom) {
    $("#bottom_navigator").attr("style","height: 63%;")
    $("#selected_filter").attr("style","height: 13%;")
    $("#expandFilter img").attr("src","https://img.icons8.com/fluency-systems-filled/48/ff7300/collapse-arrow.png")
  }
  if(open_bottom) {
    $("#bottom_navigator").attr("style","");
    $("#selected_filter").attr("style","")
    $("#expandFilter img").attr("src","https://img.icons8.com/fluency-systems-filled/48/ff7300/collapse-arrow--v2.png")
  }
  open_bottom = !open_bottom;
}

$(document).on('touchmove',"close-notch",function(e){
  height = window.innerHeight - e.touches[0].clientY - 40
  pixels = height;
  screenWidth = window.screen.width;
  percentage = ( screenWidth - pixels ) / screenWidth ;
  $("#content_brawser").attr("style","height:"+height+"px");
})

$(document).on('touchstart',"close-notch",function(e){
  height = window.innerHeight - e.touches[0].clientY - 40
  pixels = height;
  screenWidth = window.screen.width;
  percentage = ( screenWidth - pixels ) / screenWidth ;
  $("#content_brawser").attr("style","")
})

$(document).on('touchend',"close-notch",function(e){
  height = $("#content_brawser").height()
  pixels = height;
  screenWidth = window.screen.width;
  percentage = ( screenWidth - pixels ) / screenWidth ;
  
  if(percentage > 0.15) {
    $("#content_brawser").attr("style","height:6%,transition: height cubic-bezier(0, 0, 0, 0.99) 0.3s");
  } else {
    $("#content_brawser").attr("style","transition: height cubic-bezier(0, 0, 0, 0.99) 0.3s");
  }
})

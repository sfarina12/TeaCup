var dnd_class = "wizard";
var spell_types = []
var spell_list = []
var act_filter = "All";
var act_level_filter = "-"
var is_scrolling = false;

$(document).ready(function(){
  $.ajax({
    url: "https://www.dnd5eapi.co/api/classes/"+dnd_class+"/spells", 
    success: function(result){
      
      spell_types.push("All")

      thisll1 = $("<section class='active' tipo='All'>All"+htmllevel()+"</section>")
      $("#spell_types_list").prepend(thisll1)

      $($(thisll1).children()[0]).on("scroll", function(){
        thisll1.trigger("custom-scroll");
      })

      $("#spell_types_list").append(thisll1)
      $("#spell_types_list").append("<section style='color:white'>1</section>")
      $("#spell_types_list").append("<section style='color:white'>1</section>")

      result.results.forEach(function(k,v) {
        $.ajax({
          url: "https://www.dnd5eapi.co/api/spells/"+k.index, 
          success: function(result){
              type = result.school.name
              if(!spell_types.includes(type)) {
                spell_types.push(type)

                thisll = $("<section tipo='"+type+"'>"+type+htmllevel()+"</section>")
                $("#spell_types_list").prepend(thisll)

                $($(thisll).children()[0]).on("scroll", function(){
                  thisll.trigger("custom-scroll");
                })
              }

              icon = "https://www.dndbeyond.com/content/1-0-2639-0/skins/waterdeep/images/spell-schools/35/"+result.school.index+".png"
              spell_list.push(result)

              if((act_filter == type || act_filter == "All") && (act_level_filter == result.level || act_level_filter == "-")) {
                $("#lista").append(
                  '<div class="l-elem" index="'+result.index+'">'+
                      '<img width="48" height="48" style="border-radius: 50px;margin-right: 14px;" src="'+icon+'"/>'+
                      '<div class="right">'+
                          '<text style="vertical-align: top; font-weight: 700;">'+k.name+'</text>'+
                          '<text style="width: 190px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">'+result.desc+'</text>'+
                      '</div>'+
                  '</div>')
              }
            }
        });
      })
      
    }});
});

function htmllevel() {
  return '<div class="spell_types_level"><section>-</section><section>1</section><section>2</section><section>3</section><section>4</section><section>5</section><section>6</section><section>7</section><section>8</section><section>9</section><section style="color:white">.</section><section style="color:white">.</section><section style="color:white">.</section><section style="color:white">.</section><section style="color:white">.</section><section style="color:white">.</section><section style="color:white">.</section></div>';
}

var open_bottom = false;
$("body").on('click', '#expandFilter', function() {
  openclose_filter();
})

$("body").on('click', '#spell_types_list section', function() {
  filtered_type = $(this).attr("tipo")
  act_level_filter = $(".active_").html()
  act_filter = filtered_type
  $("#lista").empty()
  $("#act_filter").html(filtered_type)
  openclose_filter();
  spell_list.forEach(function(k,v) {
    if(((k.school.name == filtered_type) || (filtered_type == "All")) && (k.level == act_level_filter || act_level_filter == "-")) {
      icon = "https://www.dndbeyond.com/content/1-0-2639-0/skins/waterdeep/images/spell-schools/35/"+k.school.index+".png"
      $("#lista").append(
        '<div class="l-elem" index="'+k.index+'">'+
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
  $("#spell_types_list").removeClass("hidden")
  if(!open_bottom) {
    $("#bottom_navigator").attr("style","height: 30%;")
    $("#selected_filter").attr("style","height: 36%;")
    $("#expandFilter img").attr("src","https://img.icons8.com/fluency-systems-filled/48/ff7300/collapse-arrow.png")
  }
  if(open_bottom) {
    $("#bottom_navigator").attr("style","");
    $("#selected_filter").attr("style","")
    $("#expandFilter img").attr("src","https://img.icons8.com/fluency-systems-filled/48/ff7300/collapse-arrow--v2.png")
    $("#act_filter").html(act_filter)
  }
  open_bottom = !open_bottom;
}

$(document).on('touchmove',"#touchSupport",function(e){
  height = window.innerHeight - e.touches[0].clientY - 40
  pixels = height;
  screenWidth = window.screen.width;
  percentage = ( screenWidth - pixels ) / screenWidth ;
  $("#content_brawser").attr("style","height:"+height+"px");
})

$(document).on('touchstart',"#touchSupport",function(e){
  height = window.innerHeight - e.touches[0].clientY - 40
  pixels = height;
  screenWidth = window.screen.width;
  percentage = ( screenWidth - pixels ) / screenWidth ;
  $("#content_brawser").attr("style","height:"+height+"px");
})

$(document).on('touchend',"#touchSupport",function(e){
  height = $("#content_brawser").height()
  pixels = height;
  screenWidth = window.screen.width;
  percentage = ( screenWidth - pixels ) / screenWidth ;
  console.log(percentage > 0.15)
  if(percentage > 0.15) {
    $("#content_brawser").attr("style","height:6%;background:white; transition: height cubic-bezier(0, 0, 0, 0.99) 0.3s,background cubic-bezier(0, 0, 0, 0.99) 0.3s;");
  } else {
    $("#content_brawser").attr("style","transition: height cubic-bezier(0, 0, 0, 0.99) 0.3s,background cubic-bezier(0, 0, 0, 0.99) 0.3s;");
  }
})

$("#spell_types_list").on("scroll",function(){
  ll = $("#spell_types_list").children()
  ll.each(function (index, ele) {
    if (Math.abs(ele.getBoundingClientRect().top - $("#spell_types_list")[0].getBoundingClientRect().top) < 15) {
      $(ele).addClass("active")
      $($(ele).children()[0]).addClass("visible")
      
    } else {
      $(ele).removeClass("active")
      $($(ele).children()[0]).removeClass("visible")
    }
  });
})

$("body").on("custom-scroll",function(){
  ll = $(".spell_types_level").children()
  ll.each(function (index, ele) {
    if (Math.abs(ele.getBoundingClientRect().left - $(ele).parent()[0].getBoundingClientRect().left) < 10) {
      if($($($(ele).parent()).parent()).hasClass("active"))
        $(ele).addClass("active_")
    } else {
      $(ele).removeClass("active_")
    }
  });
})

$("#lista").on("scroll",function(){ is_scrolling = true; }) 
$(document).on("touchstart","#content_brawser",function(){ is_scrolling = false; }) 

$(document).on('touchend',".l-elem",function(e){
  if(!is_scrolling) {
    var spell_id = $(this).attr("index")
    
    if(openclose_info()) {
      $.ajax({
        url: "https://www.dnd5eapi.co/api/spells/"+spell_id, 
        success: function(result){
          fill_info(result)
        }
      });
    }
  }
})

function openclose_info() {
  $("#spell_types_list").addClass("hidden")
  if(!open_bottom) {
    $("#bottom_navigator").attr("style","height: 75%;")
    $("#selected_filter").attr("style","height: 14%;")
    $("#expandFilter img").attr("src","https://img.icons8.com/fluency-systems-filled/48/ff7300/collapse-arrow.png")
  }
  if(open_bottom) {
    $("#bottom_navigator").attr("style","");
    $("#selected_filter").attr("style","")
    $("#expandFilter img").attr("src","https://img.icons8.com/fluency-systems-filled/48/ff7300/collapse-arrow--v2.png") 
  }
  open_bottom = !open_bottom;
  return open_bottom
}

function fill_info(spell) {
  $("#level").html(spell.level)
  $("#act_filter").html(spell.name)
  $("#desc").html(spell.desc)
  $("#higher_level").html(spell.higher_level)
  var calc = spell.range.substring(0,spell.range.indexOf(" feet"))
  $("#range").html(Math.floor(calc / 3.28084)+" meters")

  var is_material = false;
  $("#components").empty()
  spell.components.forEach(function(k,v) {
    va = k
    if(k == "V") va = "View"
    if(k == "S") va = "Speech"
    if(k == "M") {va = "Materials"; is_material = true;}
    $("#components").append("<div>"+va+"</div>")
  })

  if(!is_material) $("#material").addClass("hidden")
  else $("#material").removeClass("hidden")
  $("#material").html(spell.material)

  $("#ritual").html(spell.ritual)
  
  $("#duration").html('<img width="28" height="28" src="https://img.icons8.com/windows/32/clock--v1.png"/>'+(spell.duration == null ? "-" : spell.duration))
  if(spell.concentration)
  $("#concentration").html('<img width="28" height="28" src="https://img.icons8.com/windows/32/aperture.png"/>'+(spell.concentration == null ? "-" : spell.concentration))
  $("#casting_time").html('<img width="28" height="28" src="https://img.icons8.com/windows/32/fantasy.png"/>'+(spell.casting_time == null ? "-" : spell.casting_time))
  
  if(spell.attack_type == null && spell.damage == null && spell.dc.dc_type == null) $("#attack_type").addClass("hidden")
  else $("#attack_type").removeClass("hidden")

  $("#attack_type").html('<img width="28" height="28" src="https://img.icons8.com/windows/32/sword.png"/>' + (spell.attack_type == null ? "" : spell.attack_type))
  if(spell.damage != null) {
    damage = ""
    if(spell.damage.damage_at_slot_level != null) {
      damage = "("
      spell.damage.damage_at_slot_level.each(function(k,v) {
        damage += k+":"+v+";"
      })
      damage = ")"
    }
    comma = spell.attack_type == null ? "" : ", "
    $("#attack_type").append(comma+spell.damage.damage_type.name+damage)
  } else {
    damage = ""
    if(spell.dc.desc != null) damage = "("+spell.dc.desc+")"
    comma = spell.attack_type == null ? "" : ", "
    $("#attack_type").append(comma+"DC "+spell.dc.dc_type.name+damage)
  }
  
}
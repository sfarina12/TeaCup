var dnd_class = "wizard";
var spell_types = []
var spell_list = []
var act_filter = "All";
var act_level_filter = "-"
var is_scrolling = false;
var act_class = "wizard"
var ajax_requests = []
var searchOpen = false
var searchValue = ""

$(document).ready(function(){});

function htmllevel() {
  return '<div class="spell_types_level"><section>-</section><section>T</section><section>1</section><section>2</section><section>3</section><section>4</section><section>5</section><section>6</section><section>7</section><section>8</section><section class="lastSelect">9</section>';
}

var open_bottom = false;
$("body").on('click', '#expandFilter', function() {
  openclose_filter();
})

$("body").on('click', '#spell_types_list section', function() {
  filtered_type = $(this).attr("tipo")
  
  act_level_filter = $(".active_").html() == null ? "-" : $(".active_").html()
  
  $("#lista").empty()
  var tmp = act_level_filter == "-"?"":act_level_filter
  $("#act_filter").html(filtered_type+" "+tmp)

  act_filter = filtered_type
  act_level_filter = act_level_filter == "T" ? "0" : act_level_filter

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

  if(!searchOpen) {
    if(!open_bottom) {
      $("#bottom_navigator").attr("style","height: 30%;")
      $("#selected_filter").attr("style","height: 36%;")
      $("#expandFilter img").attr("src","https://img.icons8.com/fluency-systems-filled/48/ff7300/collapse-arrow.png")
    }
    if(open_bottom) {
      $("#bottom_navigator").attr("style","");
      $("#selected_filter").attr("style","")
      $("#expandFilter img").attr("src","https://img.icons8.com/fluency-systems-filled/48/ff7300/collapse-arrow--v2.png")
    
      var tmp = act_level_filter == "0" ? "T" : act_level_filter
      tmp = act_level_filter == "-" ? "" : tmp
      $("#act_filter").html(act_filter+" "+tmp)
    }

    open_bottom = !open_bottom;
  } else {
    $("#expandFilter img").attr("src","https://img.icons8.com/windows/48/ff7300/multiply.png")
    $("#bottom_navigator").attr("style","");
    $("#selected_filter").attr("style","")
    $("#expandFilter img").attr("src","https://img.icons8.com/fluency-systems-filled/48/ff7300/collapse-arrow--v2.png")
  }
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
  if(percentage > 0.15) {
    $("#content_brawser").attr("style","height:6%;background:white; transition: height cubic-bezier(0, 0, 0, 0.99) 0.3s,background cubic-bezier(0, 0, 0, 0.99) 0.3s;");
    $("#search").attr("style","left: -100%;")
    openClose_search(true)
  } else {
    $("#content_brawser").attr("style","transition: height cubic-bezier(0, 0, 0, 0.99) 0.3s,background cubic-bezier(0, 0, 0, 0.99) 0.3s;");
    $("#search").attr("style","")
  }
})

$("#spell_types_list").on("scroll",function(){
  ll = $("#spell_types_list").children()
  $(".active_").removeClass("active_")
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
  $(".active_").removeClass("active_")
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
      $("#loading_spell").removeClass("hidden")
      $.ajax({
        url: "https://www.dnd5eapi.co/api/spells/"+spell_id, 
        success: function(result){
          fill_info(result)
        },
        complete: function() {
          $("#loading_spell").addClass("hidden")
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
  $("#level").html(spell.level == "0" ? "T" : spell.level)
  $("#act_filter").html(spell.name)
  
  $("#desc").html(hightlite(spell.desc))
  
  $("#higher_level").html(hightlite(spell.higher_level))
  if(spell.range != 'Self') {
    var calc = spell.range.substring(0,spell.range.indexOf(" feet"))
    calc = Math.floor(calc / 3.28084)
    if(calc != 0) $("#range").html(calc+" meters")
  } else {
    $("#range").html("Self")
  }

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
  
  if(spell.attack_type == null && spell.damage == null && spell.dc == null) $("#attack_type").addClass("hidden")
  else $("#attack_type").removeClass("hidden")

  $("#attack_type").html('<img width="28" height="28" src="https://img.icons8.com/windows/32/sword.png"/>' + (spell.attack_type == null ? "" : spell.attack_type))
  if(spell.damage != null) {
    damage = ""
    if(spell.damage.damage_at_slot_level != null) {
      damage = "(";
      Object.entries(spell.damage.damage_at_slot_level).forEach(function(k,v) {
        damage += " level "+k[0]+": "+k[1]+";"
      })
      damage = damage.substring(0,damage.lastIndexOf(";"))
      damage += ")"
    }
    comma = spell.attack_type == null ? "" : ", "
    nameDmg = spell.damage.damage_type == null ? "" : spell.damage.damage_type.name
    $("#attack_type").append(comma+nameDmg+damage)
  } else {
    damage = ""
    if(spell.dc != null) {
      damage = "("+spell.dc.desc+")"
      comma = spell.attack_type == null ? "" : ", "
      nameDmg = spell.dc.dc_type == null ? "" : spell.dc.dc_type.name
      $("#attack_type").append(comma+"DC "+nameDmg+damage)
    }
  }
  
}

$("#class_list").on("scroll",function(){
  clearTimeout($.data(this, 'scrollTimer'));
  $.data(this, 'scrollTimer', setTimeout(function() {
    ll = $("#class_list").children()
    $(".active_").removeClass("active_")
    ll.each(function (index, ele) {
      if (Math.abs(ele.getBoundingClientRect().left - $("#class_list")[0].getBoundingClientRect().left) < 15) {
        ajax_requests.forEach(function(k,v){
          k.abort()
        })
        //force_stop = true
        act_class = $(ele).attr("dnd") 
        $("#lista").empty()
        $("#spell_types_list").empty()
        spell_types = []
        spell_list = []
        ajax_requests = []
        load_spell();    
      } else {
      }
    });
  }, 250));
})

function hightlite(text) {
  var description = String(text)
  var found = description.match(/[0-9]\w+/g)
  if(found != null) {
    found.forEach(function(k,v) {
      if(k.includes("d") && !k.includes("nd")) {
        description = String(description).replaceAll(k,"<b>"+k+"</b>")
      }
    })
  }
  return description
}

function load_spell() { 
  $("#loading_failed").addClass("hidden")
  $.ajax({
    url: "https://www.dnd5eapi.co/api/classes/"+act_class+"/spells", 
    success: function(result){
      
      $("#loading_list").removeClass("hidden")
      
      var total_request = 0;
      var count_request = 0;

      if(result.count == 0) {
        //no spells found
        $("#loading_list").addClass("hidden")
        $("#loading_failed").removeClass("hidden")
      } else {
        spell_types.push("All")

        thisll1 = $("<section class='active lastSelectVertical' tipo='All'>All"+htmllevel()+"</section>")
        $("#spell_types_list").prepend(thisll1)

        $($(thisll1).children()[0]).on("scroll", function(){
          thisll1.trigger("custom-scroll");
        })

        //$("#spell_types_list").append(thisll1)
        //$("#spell_types_list").append("<section style='color:white'>1</section>")
        //$("#spell_types_list").append("<section style='color:white'>1</section>")
      }

      result.results.forEach(function(k,v) {
        total_request++;

        //if(!force_stop) {
          ajax_requests.push(
            $.ajax({
            url: "https://www.dnd5eapi.co/api/spells/"+k.index, 
            success: function(result){
                count_request++;
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

                magin_name = (result.name.toLowerCase()).replace(/\s/g, '')
                var condition = false;

                if((act_filter == type || act_filter == "All") && (act_level_filter == result.level || act_level_filter == "-") && searchValue == "")  condition = true
                if(magin_name.includes(searchValue)) condition = true

                if(condition) {
                  $("#lista").append(
                    '<div class="l-elem" index="'+result.index+'">'+
                        '<img width="48" height="48" style="border-radius: 50px;margin-right: 14px;" src="'+icon+'"/>'+
                        '<div class="right">'+
                            '<text style="vertical-align: top; font-weight: 700;">'+k.name+'</text>'+
                            '<text style="width: 190px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">'+result.desc+'</text>'+
                        '</div>'+
                    '</div>')
                }

                if(total_request == count_request)
                  $("#loading_list").addClass("hidden")
              }
            })
          )
        //}
      })
    }});
}

$(document).on('touchend',"#searchIcon",function(){
  openClose_search()
})

function openClose_search(close = false) {
  if(!close) {
    searchOpen = !searchOpen
    searchValue = ""
    $("#searchContainer input").val("")
    if(searchOpen) {
      openclose_filter()
      $("#searchContainer").attr("style","width:100%")
      $("#searchIcon").attr("style","background-color:#FF7300")
      $("#searchIcon img").attr("src","https://img.icons8.com/windows/96/FFFFFF/search--v1.png")
    } else {
      searchByName("")
      $("#searchContainer").attr("style","")
      $("#searchIcon").attr("style","")
      $("#searchIcon img").attr("src","https://img.icons8.com/windows/96/FF7300/search--v1.png")
    }
  } else {
    searchOpen = false
    searchValue = ""
    $("#searchContainer input").val("")
    searchByName("")
    $("#searchContainer").attr("style","")
    $("#searchIcon").attr("style","")
    $("#searchIcon img").attr("src","https://img.icons8.com/windows/96/FF7300/search--v1.png")
  }
}

$(document).on("keyup","#searchContainer input",function(){
  searchByName($(this).val())
})

function searchByName(textTuSearch) {
  searchValue = (textTuSearch.toLowerCase()).replace(/\s/g, '')
  $("#lista").empty()
  
  if(textTuSearch != "")
    $("#act_filter").html(searchValue)
  else $("#act_filter").html("All")

  act_filter = "All"
  act_level_filter = "-"

  spell_list.forEach(function(k,v) {
    magin_name = (k.name.toLowerCase()).replace(/\s/g, '')
    if(magin_name.includes(searchValue)) {
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
}
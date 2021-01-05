

function show(id,name){

  $("#delactivityId").text(name);
  $("#deleteActivityAction").attr("href" ,"/deleteActivity/"+id);

  }

  function saveActivity(){
  document.saveActFrm.action ="saveActivity";
  document.saveActFrm.username="moin1234";
  document.saveActFrm.password="password";
  document.saveActFrm.method="POST";
  document.saveActFrm.submit();
  }
  //$("#deleteActivityAction").attr("href","/deleteActivity/"+$("#delActivityBtn").attr("delActivityId"));
//alert();

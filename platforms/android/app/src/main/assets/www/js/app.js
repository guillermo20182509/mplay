/*****************************
Autor:Jose Carlos Ruiz
Fecha Modificacion: 07/07/2018
Archivo JS
******************************/
var $$ = Dom7;

var app7 = new Framework7({
  // App root element
  root: '#app',
  // App Name
  name: 'My App',
  // App id
  id: 'com.myapp.test',
  // Enable swipe panel
  /*panel: {
    swipe: 'left',
  },*/
  // Add default routes
  routes: routes
  // ... other parameters
});


var mainView = app7.views.create('.view-main'); 


var app = {

    
    autenticado: false,
    usuario:"",
    password:"",
    name:"",
    hostname:"http://www.tsjservicios.com.mx",
    urlVideo:"",
    tituloVideo:"",

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');


 console.log("VARIABLE AUTENTICADO:"+window.localStorage.getItem("autenticado"));


         if(window.localStorage.getItem("autenticado")=="true"){

                mainView.router.navigate('/home/',{animate:false});
         }
        
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
       /* var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);*/
    },
    loginAccess:function(){


      this.usuario = $$('#usuario').val();
      this.password = $$('#password').val();


      if(this.usuario == "" || this.password == ""){
         
         app7.dialog.alert('Debes de ingresar usuario y/o contraseña');
           
      }else{

        app7.preloader.show();
        

        app7.request({
           url: this.hostname+'/mplay250890/api/login.php',
           data:{username:this.usuario,password:this.password},
           method:'POST',
           crossDomain: true,
           success:function(data){
            
            app7.preloader.hide();

            var objson = JSON.parse(data);
            if(objson.data =="AUTENTICADO"){

            
            window.localStorage.setItem("autenticado", "true");
            this.autenticado = window.localStorage.getItem("autenticado");
            
            mainView.router.navigate('/home/',{animate:true});
            }else{
               app7.dialog.alert("Usuario o Password incorrecto");
            }
            
           
           },
           error:function(error){

            app7.preloader.hide();
            app7.dialog.alert("Hubo un error por favor intenta nuevamente");
            console.log(data);
           }
           
        });
             
          

      }

    },
    
    RegisterAccess:function(){

      mainView.router.navigate('/register/',{animate:true});
    
    },

    RegisterUser:function(){
      
      this.name = $$('#frm_name').val();
      this.usuario = $$('#frm_username').val();
      this.password = $$('#frm_password').val();

      app7.request({
           url: this.hostname+'/mplay250890/api/users.php',
           data:{name:this.name,username:this.usuario,password:this.password},
           method:'POST',
           crossDomain: true,
           success:function(data){
            
            app7.preloader.hide();

            var objson = JSON.parse(data);
           
            
           
           },
           error:function(error){

            app7.preloader.hide();
            app7.dialog.alert("Hubo un error por favor intenta nuevamente");
            console.log(data);
           }
           
        });

    

    },
    sendComments:function(){
           
           var nombre = $$('#ctc_nombre').val();
           var email = $$('#ctc_email').val();
           var asunto = $$('#ctc_asunto').val();
           var comentarios = $$('#ctc_comentarios').val();


          app7.preloader.show();

          app7.request({
           url: this.hostname+'/mplay250890/api/contacto.php',
           data:{nombre:nombre,email:email,asunto:asunto,comentarios:comentarios},
           method:'POST',
           crossDomain: true,
           success:function(data){
            
            app7.preloader.hide();

            var objson = JSON.parse(data);
            app7.dialog.alert("Hemos recibido su mensaje correctamente"); 
            mainView.router.navigate('/home/',{animate:true});
           
           },
           error:function(error){

            app7.preloader.hide();
            app7.dialog.alert("Hubo un error por favor intenta nuevamente");
            console.log(data);
           }
           
        });



    },

    loginClose:function(){
     

        app7.panel.close();
        app7.dialog.confirm('¿Seguro, deseas salir de la aplicación?', function () {
            
        window.localStorage.setItem("autenticado", "false");
        mainView.router.navigate('/login/',{animate:true});
    
      });

    }
};


function showMenu(){

   app7.panel.open('left', true);

}


$$(document).on('page:init', '.page[data-name="home"]', function (e) {
      console.log('View Home load Init!');
      app7.panel.allowOpen = true;
      app7.panel.enableSwipe('left');

      var $ptrContent = app7.ptr.create('.ptr-content');

      $ptrContent.on('refresh', function (e) {
          RefreshVideos();
           getSlider();
      });


      getSlider();
      getVideos();


   /*   var mySwiper = new Swiper('.swiper-container', {
  autoplay: {
    delay: 1000,
  }
});*/

});


$$(document).on('page:init', '.page[data-name="search"]', function (e) {
 //buscar("olimpiadas");

 $$('#buscar').on('keyup', function (e) {

  
      var keyCode  = e.keyCode || e.which;
      if(keyCode == 13){
          console.log(keyCode);
        //buscar($$('#buscar').val());
          e.preventDefault();
          return false;

      }else{

      }
});

});
function buscar(buscar){

    var buscar= buscar;
    $$('#list-search').html("");
    app7.preloader.show();

    console.log("entra search");
 
   app7.request({
            url: app.hostname+'/mplay250890/api/search.php?buscar='+buscar,
            method:'GET',
            crossDomain: true,
            success:function(data){
             
             app7.preloader.hide();
 
             var objson = JSON.parse(data);
            var video = "";
            if (objson.data== "NO_ENCONTRADOS"){
                    app7.dialog.alert("No se encontro resultados");

            }else {
            for(x in objson.data){
                   console.log(objson.data[x].titulo);
                   
                   video = '<li><a href="#" class="item-link item-content"><div class="item-media"><img src="./img/post2.jpg" width="80"/></div><div class="item-inner"><div class="item-title-row"><div class="item-title">'+objson.data[x].titulo+'</div><div class="item-after">$15</div></div><div class="item-subtitle">'+objson.data[x].autor+'</div><div class="item-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus.</div></div></a></li>';
 
                    $$('#list-search').append(video);
 
              }
            }
            },
            error:function(error){
 
             app7.preloader.hide();
             app7.dialog.alert("Hubo un error por favor intenta nuevamente");
             console.log(error);
            }
            
         });
 
 
 }

function getVideos(){

 app7.preloader.show();

  app7.request({
           url: app.hostname+'/mplay250890/api/videos.php',
           method:'GET',
           crossDomain: true,
           success:function(data){
            
            app7.preloader.hide();

            var objson = JSON.parse(data);
            var video = "";
             var img="";

             for(x in objson.data){
                  console.log(objson.data[x].titulo);
                    img=app.hostname+'/mplay250890/img/'+objson.data[x].imagen;
                  video = '<div class="item"><div class="post"><img src="'+img+'" onClick="goVideo(\''+objson.data[x].titulo+'\', \''+objson.data[x].url+'\')"><div class="time">10:06</div></div><h5>'+objson.data[x].titulo+'</h5><p>'+objson.data[x].autor+'</p><p>25 Visitas | 20 Agosto</p></div>';

                   $$('#content-videos').append(video);

             }
           
           },
           error:function(error){

            app7.preloader.hide();
            app7.dialog.alert("Hubo un error por favor intenta nuevamente");
            console.log(error);
           }
           
        });


}


function RefreshVideos(){

   app7.request({
           url: app.hostname+'/mplay250890/api/videos.php',
           method:'GET',
           crossDomain: true,
           success:function(data){
            
            app7.ptr.done();
            $$('#content-videos').html("");
                  
            var objson = JSON.parse(data);
            var video = "";
             
             for(x in objson.data){
                  console.log(objson.data[x].titulo);

                  video = '<div class="item"><div class="post"><img src="img/post2.jpg"><div class="time">10:06</div></div><h5>'+objson.data[x].titulo+'</h5><p>'+objson.data[x].autor+'</p><p>25 Visitas | 20 Agosto</p></div>';

                   $$('#content-videos').append(video);

             }
           
           },
           error:function(error){

            app7.preloader.hide();
            app7.dialog.alert("Hubo un error por favor intenta nuevamente");
            console.log(error);
           }
           
        });



  }




  function getSlider(){


 app7.preloader.show();

  app7.request({
           url: app.hostname+'/mplay250890/api/slider.php',
           method:'GET',
           crossDomain: true,
           success:function(data){
            
            app7.preloader.hide();

            var objson = JSON.parse(data);
            var video = "";
             
             var swiper = app7.swiper.get('.swiper-container');
             swiper.removeAllSlides();

             for(x in objson.data){
                  console.log(objson.data[x].titulo);
                  img=app.hostname+'/mplay250890/img/'+objson.data[x].imagen;
                 
                  var slide = '<div class="swiper-slide"><div class="mask"></div><img src="'+img+'" /><div class="caption"><h2>10 very beautiful rugby ball catches</h2><p>10 Junio 2018</p><button>Play Now</button></div></div>';
                      
                  swiper.appendSlide(slide);


             }
           
           },
           error:function(error){

            app7.preloader.hide();
            app7.dialog.alert("Hubo un error por favor intenta nuevamente");
            console.log(error);
           }
           
        });


}
function goVideo(id){
    mainView.router.navigate('/video/',{animate:true});
}


function buscar(buscar){

    var buscar= buscar;
    $$('#list-search').html("");
    app7.preloader.show();
 
   app7.request({
            url: app.hostname+'/mplay250890/api/search.php?buscar='+buscar,
            method:'GET',
            crossDomain: true,
            success:function(data){
             
             app7.preloader.hide();
 
             var objson = JSON.parse(data);
            var video = "";
            if (objson.data== "NO_ENCONTRADOS"){
                    app7.dialog.alert("No se encontro resultados");

            }else {
            for(x in objson.data){
                   console.log(objson.data[x].titulo);
 
                   video = '<li><a href="#" class="item-link item-content"><div class="item-media"><img src="./img/post2.jpg" width="80"/></div><div class="item-inner"><div class="item-title-row"><div class="item-title">'+objson.data[x].titulo+'</div><div class="item-after">$15</div></div><div class="item-subtitle">'+objson.data[x].autor+'</div><div class="item-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus.</div></div></a></li>';
 
                    $$('#list-search').append(video);
 
              }
            }
            },
            error:function(error){
 
             app7.preloader.hide();
             app7.dialog.alert("Hubo un error por favor intenta nuevamente");
             console.log(error);
            }
            
         });
 
 
 }

 //--------
 $$(document).on('page:init', '.page[data-name="search"]', function (e) {
  //buscar("olimpiadas");
 
  $$('#buscar').on('keyup', function (e) {
 
 
       var keyCode  = e.keyCode || e.which;
       if(keyCode === 13){
           buscar($$('#buscar').val());
           e.preventDefault();
           return false;
 
       }else{
 
       }
 });
 
 });
 function buscar(buscar){
 
     var buscar= buscar;
     $$('#list-search').html("");
     app7.preloader.show();
  
    app7.request({
             url: app.hostname+'/mplay250890/api/search.php?buscar='+buscar,
             method:'GET',
             crossDomain: true,
             success:function(data){
              
              app7.preloader.hide();
  
              var objson = JSON.parse(data);
             var video = "";
             if (objson.data== "NO_ENCONTRADOS"){
                     app7.dialog.alert("No se encontro resultados");
 
             }else {
             for(x in objson.data){
                    console.log(objson.data[x].titulo);
  
                    video = '<li><a href="#" class="item-link item-content"><div class="item-media"><img src="./img/post2.jpg" width="80"/></div><div class="item-inner"><div class="item-title-row"><div class="item-title">'+objson.data[x].titulo+'</div><div class="item-after">$15</div></div><div class="item-subtitle">'+objson.data[x].autor+'</div><div class="item-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus.</div></div></a></li>';
  
                     $$('#list-search').append(video);
  
               }
             }
             },
             error:function(error){
  
              app7.preloader.hide();
              app7.dialog.alert("Hubo un error por favor intenta nuevamente");
              console.log(error);
             }
             
          });
  
  
  }
  function goVideo(titulo,url){
      app.tituloVideo= titulo;
      app.urlVideo=url;
      mainView.router.navigate('/video/', {animate:true});

  }
  $$(document).on('page:init', '.page[data-name="video"]', function(e){
        
        console.log(app.urlVideo);
         $$('.videoyoutube iframe').remove();
         $$('<iframe width="100%" height="200" frameborder="0"  allowfullscreen></iframe>').attr('src', app.urlVideo).appendTo('.videoyoutube');
       
  });
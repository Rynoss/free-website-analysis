
$( document ).ready(function() {
  $( document ).on( "change", "input", function() {
      var values = "";
      $(".city-field").each(function(i) {
        console.log( this.value )
          values += (i > 0 ? "\n\r" : "") + this.value;
      });
      $("#00N5w00000Msx4tEAB").val(values);
  });
});

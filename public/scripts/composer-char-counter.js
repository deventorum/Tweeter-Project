$(document).ready(function() {
  $('.new-tweet').on('input', function() {
    let counterLength = $(this).children( 'textarea' ).val().length;

    $(this).children('#error').remove();

    $(this).children('.counter').html(140 - counterLength);
    if (counterLength > 140) {
      $(this).children('.counter').addClass('red');
    } else {
      $(this).children('.counter').removeClass('red')
    }
  })
});
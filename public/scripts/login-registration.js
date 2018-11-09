$(document).ready(function () {
  $('.sign-up').on('click', function() {
    $('.registration-container').slideToggle();
    $('.login-container').slideUp();
    $('main').toggleClass('padding-reg');
    $('main').removeClass('padding-log');
  })

  $('.sign-in').on('click', function() {
    $('.login-container').slideToggle();
    $('.registration-container').slideUp();
    $('main').toggleClass('padding-log');
    $('main').removeClass('padding-reg');
  })


});

// Shows how much time has past in proper units based on the input
function showTimeDiff(range) {
  
  // Helper functions, checks if 's' is necessary
  const checkSuffix = number => {
    return number === 1 ? '' : 's';
  }

  let number;
  
  if ((range / (3600 * 24 * 1000 * 365)) >= 1) {
    number = Math.floor(range / (3600 * 24 * 1000 * 365));
    return `${number} year${checkSuffix(number)} ago`

  } else if ((range * 12) / (3600 * 24 * 1000 * 365) >= 1) {
    number = Math.floor((range * 12) / (3600 * 24 * 1000 * 365));
    return `${number} month${checkSuffix(number)} ago`

  } else if ((range / (3600 * 24 * 1000 * 7)) >= 1) {
    number = Math.floor(range / (3600 * 24 * 1000 * 7));
    return `${number} week${checkSuffix(number)} ago`

  } else if ((range / (3600 * 24 * 1000)) >= 1) {
    number = Math.floor(range / (3600 * 24 * 1000));
    return `${number} day${checkSuffix(number)} ago`

  } else if ((range / (3600 * 1000)) >= 1) {
    number = Math.floor(range / (3600 * 1000));
    return `${number} hour${checkSuffix(number)} ago`;

  } else if ((range / (60 * 1000)) >= 1) {
    number = Math.floor(range / (60 * 1000));
    return `${number} minute${checkSuffix(number)} ago`;

  } else {
    return 'Just now'
  }
}

//Function that prevents XSS attack
function escape(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

$(document).ready(function() {
  
  // Function creates an html element of the tweet to be rendered
  function createTweetElement(data) {
    const $tweet = $("<article/>");
    // Header of the tweet
    const $header = $(
      `<header>
        <img class="avatar" src="${data.user.avatars.regular}" alt="users avatar">
        <h2>${data.user.name}</h2>
        <p>${data.user.handle}</p>
      </header>`
    )
    // The tweet
    const $mainBody = $(
      `<div class="tweet">
        <p>${escape(data.content.text)}</p>
      </div>`
    )
    const prevDate = data.created_at;
    const currentDate = new Date();
    // Calculates the time difference 
    const timeDiff = showTimeDiff(Math.abs(currentDate.getTime() - prevDate))
    // Footer of the tweet
    const $footer = $(
      `<footer>
        <p>${timeDiff}</p>
        <div>
          <span class="visuallyhidden">Flag</span>
          <i class="fas fa-flag"></i>
          <span class="visuallyhidden">Retweet</span>
          <i class="fas fa-retweet"></i>
          <span class="visuallyhidden">Like</span>
          <i class="fas fa-heart"></i>
        </div>
      </footer>`
    )
    return $tweet.append($header).append($mainBody).append($footer);
  }

  // Renders all tweets from the database
  function renderTweets(database) {
    database.forEach(dataset => {
      createTweetElement(dataset).insertAfter('.create-tweet')
    })
  }

  //
  function loadTweets() {
    $.ajax('/tweets', { method: 'GET' })
      .then(function (data) {
        renderTweets(data);
      });
  }
  loadTweets()

  
  // Create a post request on create tweet event
  $('.new-tweet').on('submit', function(event) {
    event.preventDefault();
    const $form = $(this);
    const $postLength = $form.children('textarea').val().length;

    // Front End Validity Checks
    // Check for an empty field
    if ($postLength === 0) {
      $form.append($(`<p id='error' class='red'>Text area is empty</p>`))
      return;
    }
    // Checks the length
    if ($postLength > 140) {
      $form.append($(`<p id='error' class='red'>Tweet is more than 140 characters long</p>`))
      return;
    }

    // Ajax insetrs a new post
    $.ajax({
      type: $form.attr('method'),
      url: $form.attr('action'),
      data: $form.serialize(),
      success: function(data)
      {
        // Insetrs new tweet after the tweet form
        createTweetElement(data).insertAfter('.create-tweet');
      }
    });
    // Clears the text area once the tweet is posted
    $form.children('textarea').val('');
  })

  $('.new-button').on('click', function() {
    $('.create-tweet').slideToggle();
    $('#tweet-text').focus();
  })


})

const data = [
  {
    "user": {
      "name": "Newton",
      "avatars": {
        "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
        "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
        "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
      },
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": {
        "small":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png",
        "regular": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png",
        "large":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png"
      },
      "handle": "@rd" },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  },
  {
    "user": {
      "name": "Johann von Goethe",
      "avatars": {
        "small":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png",
        "regular": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png",
        "large":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png"
      },
      "handle": "@johann49"
    },
    "content": {
      "text": "Es ist nichts schrecklicher als eine tätige Unwissenheit."
    },
    "created_at": 1461113796368
  }
];


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

$(document).ready(function() {
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
        <p>${data.content.text}</p>
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

  data.forEach(dataset => {
    $('.tweets').append(createTweetElement(dataset))
  })
  
})

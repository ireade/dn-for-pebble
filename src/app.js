/**
 * DN for Pebble
 * Ire Aderinokun
 * Version 2.0
 *
 */

// Require dependencies
var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');



/* Home Menu */
var homeMenu = new UI.Menu({
  backgroundColor: 'white',
  textColor: 'black',
  highlightBackgroundColor: 'blue',
  highlightTextColor: 'white',
  sections: [{
    title: 'Choose a section',
    items: [{
      title: 'Top Stories'
    }, {
      title: 'Recent Stories'
    }, {
      title: 'Discussions'
    }]
  }]
});
homeMenu.show();


/* Loading Window */
var loadingWindow = new UI.Window({
  fullscreen: true
});
var loadingBg = new UI.Rect({
  position: new Vector2(0, 0),
  size: new Vector2(144, 168),
  backgroundColor: 'blue',
});
var loadingText = new UI.Text({
  position: new Vector2(0, 60),
  size: new Vector2(144, 50),
  text:'DN for Pebble Loading',
  font:'GOTHIC_24_BOLD',
  color:'white',
  textOverflow:'wrap',
  textAlign:'center',
  backgroundColor:'clear'
});
loadingWindow.add(loadingBg);
loadingWindow.add(loadingText);



var makeRequest = function(requestURL, menuTitle) {

  ajax(
  {
    url: requestURL,
    type:'json'
  }, function(data) {
      
    /* Create Menu of 10 Top Stories */
    var menuItems = [];
    for (var i = 0; i < 10; i++) {
      var title = data.tables[0].results[i]['story_link/_text'];
      menuItems.push({
        title: title
      });
    }
    var resultsMenu = new UI.Menu({
      backgroundColor: 'white',
      textColor: 'black',
      highlightBackgroundColor: 'blue',
      highlightTextColor: 'white',
      sections: [{
        title: menuTitle,
        items: menuItems
      }]
    });
    resultsMenu.show();
    loadingWindow.hide();
      



      
    /* On Select of a story */
    resultsMenu.on('select', function(e) {

      var story = data.tables[0].results[e.itemIndex];

      var storyTitle = story['story_link/_text'];
      var storyAuthor = story['from_link/_text'];
      var storyTimeAgo = story['storytimeago_value'];
      var storyCommentCount = story['commentcount_link_numbers'];
      var storyVoteCount = story['storyvoteis_number'][0];

      
      var detailView = new UI.Window({
        scrollable: true,
        fullscreen: true
      });

      
      var headerHeight;

      if (storyTitle.length < 40 ) {
        headerHeight = 90;
      } else if (storyTitle.length > 39 && storyTitle.length < 50 ) {
        headerHeight = 110;
      } else if (storyTitle.length > 49 && storyTitle.length < 60 ) {
        headerHeight = 120;
      } else {
        headerHeight = 140;
      }

      var lineHeight = 25;
      var timeAgoPosY = headerHeight + 5;
      var voteCountPosY = headerHeight + lineHeight + 5;
      var commentCountPostY = headerHeight + (lineHeight * 2) + 5;
      var authorPosY = headerHeight + (lineHeight * 3) + 5;


      var headerBg = new UI.Rect({
        position: new Vector2(0, 0),
        size: new Vector2(144, headerHeight),
        backgroundColor: 'blue',
      });
      
      var Title = new UI.Text({
        position: new Vector2(8, 0),
        size: new Vector2(131, 80),
        text: storyTitle,
        font:'GOTHIC_24_BOLD',
        color:'white',
        textOverflow:'wrap',
        textAlign:'left',
        backgroundColor:'clear'
      });
      
      var bodyBg = new UI.Rect({
        position: new Vector2(0, headerHeight),
        size: new Vector2(144, 140),
        backgroundColor: 'white'
      });

      var TimeAgo = new UI.Text({
        position: new Vector2(8, timeAgoPosY),
        size: new Vector2(131, lineHeight),
        text: 'Posted ' + storyTimeAgo,
        font:'GOTHIC_18',
        color:'black',
        textOverflow:'wrap',
        textAlign:'left',
        backgroundColor:'clear'
      });

      var VoteCount = new UI.Text({
        position: new Vector2(8, voteCountPosY),
        size: new Vector2(131, lineHeight),
        text: storyVoteCount + ' votes',
        font:'GOTHIC_18',
        color:'black',
        textOverflow:'wrap',
        textAlign:'left',
        backgroundColor:'clear'
      });

      var CommentCount = new UI.Text({
        position: new Vector2(8, commentCountPostY),
        size: new Vector2(131, lineHeight),
        text: storyCommentCount + ' comments',
        font:'GOTHIC_18',
        color:'black',
        textOverflow:'wrap',
        textAlign:'left',
        backgroundColor:'clear'
      });

      var Author = new UI.Text({
        position: new Vector2(8, authorPosY),
        size: new Vector2(131, 50),
        text: 'Posted by ' + storyAuthor,
        font:'GOTHIC_18',
        color:'black',
        textOverflow:'wrap',
        textAlign:'left',
        backgroundColor:'clear'
      });

      
      detailView.add(headerBg);
      detailView.add(bodyBg);
      detailView.add(Title);
      detailView.add(TimeAgo);
      detailView.add(CommentCount);
      detailView.add(Author);
      detailView.add(VoteCount);
      detailView.show();

    }); // end resultsMenu.onselect


  }, function(error) {
      
      var errorText = new UI.Text({
        position: new Vector2(0, 50),
        size: new Vector2(144, 100),
        text:'Download failed: ' + error,
        font:'GOTHIC_24',
        color:'white',
        textOverflow:'wrap',
        textAlign:'center',
        backgroundColor:'clear'
      });
      
      loadingWindow.remove(loadingText);
      loadingWindow.add(errorText);
      
      console.log('Download failed: ' + error);

  }); // end AJAX



}; // end makeRequest function



var topStoriesReuqestURL = 'https://api.import.io/store/connector/_magic?url=https%3A%2F%2Fwww.designernews.co%2F&js=false&_user=59cf7cce-4fdd-4a7f-be6f-630574c6d814&_apikey=59cf7cce4fdd4a7fbe6f630574c6d814abab1e75fbbde6cf59de38356992b106d481a5277e31e78ee98026babe24c5dfe561b854cb2bbeb5459e0aaffc4370e6b656b0ed4e47ee26c417c3672d28d410';
var newStoriesReuqestURL = 'https://api.import.io/store/connector/_magic?url=https%3A%2F%2Fwww.designernews.co%2Fnew&js=false&_user=59cf7cce-4fdd-4a7f-be6f-630574c6d814&_apikey=59cf7cce4fdd4a7fbe6f630574c6d814abab1e75fbbde6cf59de38356992b106d481a5277e31e78ee98026babe24c5dfe561b854cb2bbeb5459e0aaffc4370e6b656b0ed4e47ee26c417c3672d28d410';
var discussionsRequestURL = 'https://api.import.io/store/connector/_magic?url=https%3A%2F%2Fwww.designernews.co%2Fdiscussions&js=false&_user=59cf7cce-4fdd-4a7f-be6f-630574c6d814&_apikey=59cf7cce4fdd4a7fbe6f630574c6d814abab1e75fbbde6cf59de38356992b106d481a5277e31e78ee98026babe24c5dfe561b854cb2bbeb5459e0aaffc4370e6b656b0ed4e47ee26c417c3672d28d410';

homeMenu.on('select', function(e) {

  var section = e.itemIndex;
  homeMenu.hide();
  loadingWindow.show();

  if ( section === 0 ) {
    // Top Stories
    makeRequest(topStoriesReuqestURL, "Top Stories");
  } 
  else if ( section === 1 ) {
    // Recent Stories
    makeRequest(newStoriesReuqestURL, "Recent Stories"); 
  } 
  else if ( section === 2 ) {
    // Discussions Stories
    makeRequest(discussionsRequestURL, "Discussions");
  }
});
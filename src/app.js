/**
 * DN for Pebble
 * Ire Aderinokun
 *
 */

// Require dependencies
var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');


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
  position: new Vector2(0, 50),
  size: new Vector2(144, 50),
  text:'DN Loading',
  font:'GOTHIC_24',
  color:'white',
  textOverflow:'wrap',
  textAlign:'center',
  backgroundColor:'clear'
});

loadingWindow.add(loadingBg);
loadingWindow.add(loadingText);
loadingWindow.show();




// DN Request URL
var dnRequestURL = 'https://api.import.io/store/connector/_magic?url=https%3A%2F%2Fwww.designernews.co%2F%3Fformat%3Drss&js=false&_user=59cf7cce-4fdd-4a7f-be6f-630574c6d814&_apikey=59cf7cce4fdd4a7fbe6f630574c6d814abab1e75fbbde6cf59de38356992b106d481a5277e31e78ee98026babe24c5dfe561b854cb2bbeb5459e0aaffc4370e6b656b0ed4e47ee26c417c3672d28d410';

// Function to parse the JSON object returned
var parseFeed = function(data, quantity) {
  var items = [];
  
  for(var i = 0; i < quantity; i++) {
    var title = data.tables[0].results[i].value_1;
    items.push({
      title: title
    });
  }
  
  return items;
};


ajax(
  {
    url: dnRequestURL,
    type:'json'
  },
  function(data) {
    
    /* Create Menu of 10 Top Stories */
    var menuItems = parseFeed(data, 10);
    
    var resultsMenu = new UI.Menu({
      backgroundColor: 'white',
      textColor: 'black',
      highlightBackgroundColor: 'blue',
      highlightTextColor: 'white',
      sections: [{
        title: 'Top Stories',
        items: menuItems
      }]
    });
  
    resultsMenu.show();
    loadingWindow.hide();
    
    
    /* On Select of a story */
    resultsMenu.on('select', function(e) {

      var story = data.tables[0].results[e.itemIndex];
      var storyTitle = story.value_1;
      var storyDescription = story.description;
      
      var detailView = new UI.Window({
        scrollable: true,
        fullscreen: true
      });

      
      var headerHeight;
      var descriptionPos;
      
      if (storyTitle.length < 40 ) {
        headerHeight = 90;
        descriptionPos = new Vector2(8, 95);
      } else if (storyTitle.length > 39 && storyTitle.length < 50 ) {
        headerHeight = 110;
        descriptionPos = new Vector2(8, 115);
      } else if (storyTitle.length > 49 && storyTitle.length < 60 ) {
        headerHeight = 120;
        descriptionPos = new Vector2(8, 125);
      } else {
        headerHeight = 140;
        descriptionPos = new Vector2(8, 145);
      }



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
        size: new Vector2(144, 320),
        backgroundColor: 'white'
      });
      var Description = new UI.Text({
        position: descriptionPos,
        size: new Vector2(131, 300),
        text: storyDescription,
        font:'GOTHIC_18',
        color:'black',
        textOverflow:'wrap',
        textAlign:'left',
        backgroundColor:'clear'
      });


      detailView.add(headerBg);
      detailView.add(bodyBg);
      detailView.add(Title);
      detailView.add(Description);
      detailView.show();

    });


  },
  function(error) {
    
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
  }
);

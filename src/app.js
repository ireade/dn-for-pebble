/**
 * DN for Pebble
 * Ire Aderinokun
 *
 * https://import.io for generating JSON Url
 */

var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');


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


var parseFeed = function(data, quantity) {
  var items = [];
  for(var i = 0; i < quantity; i++) {
    var title = data.tables[0].results[i].value_1;
    items.push({
      title: title
    });
  }
  // Finally return whole array
  return items;
};

var dnRequestURL = 'https://api.import.io/store/connector/_magic?url=https%3A%2F%2Fwww.designernews.co%2F%3Fformat%3Drss&js=false&_user=59cf7cce-4fdd-4a7f-be6f-630574c6d814&_apikey=59cf7cce4fdd4a7fbe6f630574c6d814abab1e75fbbde6cf59de38356992b106d481a5277e31e78ee98026babe24c5dfe561b854cb2bbeb5459e0aaffc4370e6b656b0ed4e47ee26c417c3672d28d410';

ajax(
  {
    url: dnRequestURL,
    type:'json'
  },
  function(data) {
    
    // Create an array of Menu items
    var menuItems = parseFeed(data, 10);
    
    // Construct Menu to show to user
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

    // Show the Menu, hide the splash
    resultsMenu.show();
    loadingWindow.hide();

    // Add an action for SELECT
    resultsMenu.on('select', function(e) {

      var story = data.tables[0].results[e.itemIndex];

      var storyTitle = story.value_1;
      var storyDescription = story.description;
      
      var detailView = new UI.Window({
        scrollable: true,
        fullscreen: true
      });
      

      var headerBg = new UI.Rect({
        position: new Vector2(0, 0),
        size: new Vector2(144, 105),
        backgroundColor: 'blue'
      });
      
      var bodyBg = new UI.Rect({
        position: new Vector2(0, 105),
        size: new Vector2(144, 320),
        backgroundColor: 'white'
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
      
      var Description = new UI.Text({
        position: new Vector2(8, 110),
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
    console.log('Download failed: ' + error);
  }
);




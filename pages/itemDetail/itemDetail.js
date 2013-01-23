(function () {
    "use strict";
    var storage = Windows.Storage;
    var dtm = Windows.ApplicationModel.DataTransfer.DataTransferManager;
    var item;



    var start = Windows.UI.StartScreen;
  //  var storage = Windows.Storage;
  //  var dtm = Windows.ApplicationModel.DataTransfer.DataTransferManager;

    var capture = Windows.Media.Capture;
    var _photo;
    var _video;

    var notify = Windows.UI.Notifications;
    var popups = Windows.UI.Popups;
  //  var item;

    WinJS.UI.Pages.define("/pages/itemDetail/itemDetail.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
           item = options && options.item ? Data.resolveItemReference(options.item) : Data.items.getAt(0);
            element.querySelector(".titlearea .pagetitle").textContent = item.group.title;
            element.querySelector("article .item-title").textContent = item.title;
            element.querySelector("article .item-i").src = item.hello;
            element.querySelector("article .item-subtitle").textContent = item.preptime;
            element.querySelector("article .item-image").src = item.backgroundImage;
            element.querySelector("article .item-subtitle1").textContent = item.shortTitle;
            element.querySelector("article .item-description").textContent = item.group.description;
           

            
                element.querySelector("article .item-tutorial").textContent = item.tutorial.content1.p1;
                element.querySelector("article .item-tutorial1").textContent = item.tutorial.content1.p2;
                element.querySelector("article .item-tutorial2").textContent = item.tutorial.content1.p3;
                element.querySelector("article .item-tutorial3").textContent = item.tutorial.content1.p4;
                element.querySelector("article .item-tutorial4").textContent = item.tutorial.content1.p5;
            //    element.querySelector("article .item-tutorial5").textContent = item.tutorial.content1.p6;
                element.querySelector("article .item-tutorial6").textContent = item.tutorial.content1.p7;
                element.querySelector("article .item-tutorial7").textContent = item.tutorial.content1.p8;
                element.querySelector("article .item-tutorial8").textContent = item.tutorial.content1.p9;
                element.querySelector("article .item-tutorial9").textContent = item.tutorial.content1.p10;
                element.querySelector("article .item-tutorial10").textContent = item.tutorial.content1.p11;
                

                element.querySelector("article .item-tutorial11").textContent = item.tutorial.content2.p1;
                element.querySelector("article .item-tutorial12").textContent = item.tutorial.content2.p2;
                element.querySelector("article .item-tutorial13").textContent = item.tutorial.content2.p3;
                element.querySelector("article .item-tutorial14").textContent = item.tutorial.content2.p4;
                element.querySelector("article .item-tutorial15").textContent = item.tutorial.content2.p5;
                element.querySelector("article .item-tutorial16").textContent = item.tutorial.content2.p6;
                element.querySelector("article .item-tutorial17").textContent = item.tutorial.content2.p7;
                element.querySelector("article .item-tutorial18").textContent = item.tutorial.content2.p8;
              
              

            // Display ingredients list
         /*   var ingredients = element.querySelector("article .item-ingredients");
            for (var i = 0; i < item.ingredients.length; i++) {
                var ingredient = document.createElement("h2");
                ingredient.textContent = item.ingredients[i];
                ingredient.className = "ingredient";
                ingredients.appendChild(ingredient);
            }
            */
            // Display cooking directions
          //  element.querySelector("article .item-directions").textContent = item.directions;
            element.querySelector(".content").focus();

          
            //handle click events from the pin command

            document.getElementById("pin").addEventListener("click", function (e) {

                var uri = new Windows.Foundation.Uri("ms-appx:///" + item.tileImage);

                var tile = new start.SecondaryTile(
                    item.key, //tile id
                    item.shortTitle, //tile short name
                    item.title, //title display name
                    JSON.stringify(Data.getItemReference(item)), //Activation argument
                    start.TileOptions.showNameOnLogo, //tile logo uri
                    uri
                );

                tile.requestCreateAsync();
            });

           
            // Handle click events from the Reminder command
            document.getElementById("remind").addEventListener("click", function (e) {
                // Create a toast notifier
                var notifier = notify.ToastNotificationManager.createToastNotifier();

                // Make sure notifications are enabled
                if (notifier.setting != notify.NotificationSetting.enabled) {
                    var dialog = new popups.MessageDialog("Notifications are currently disabled");
                    dialog.showAsync();
                    return;
                }

                // Get a toast template and insert a text node containing a message
                var template = notify.ToastNotificationManager.getTemplateContent(notify.ToastTemplateType.toastText01);
                var element = template.getElementsByTagName("text")[0];
                element.appendChild(template.createTextNode("Reminder!"));

                // Schedule the toast to appear 30 seconds from now
                var date = new Date(new Date().getTime() + 30000);
                var stn = notify.ScheduledToastNotification(template, date);
                notifier.addToSchedule(stn);
            });
            //Register for datarequested events for sharing
            dtm.getForCurrentView().addEventListener("datarequested", this.onDataRequested);



        },

        onDataRequested: function (e) {
          
                var request = e.request;
                request.data.properties.title = item.title;

                if (_photo != null) {
                    request.data.properties.description = "Recipe photo";
                    var reference = storage.Streams.RandomAccessStreamReference.createFromFile(_photo);
                    request.data.properties.Thumbnail = reference;
                    request.data.setBitmap(reference);
                    _photo = null;
                }
                else {
                    request.data.properties.description = "Recipe ingredients and directions";

                    // Share recipe text
                    var recipe = "\r\nINGREDIENTS\r\n" + item.ingredients.join("\r\n");
                    recipe += ("\r\n\r\nDIRECTIONS\r\n" + item.directions);
                    request.data.setText(recipe);

                    // Share recipe image
                    var uri = item.backgroundImage;
                    if (item.backgroundImage.indexOf("http://") != 0)
                        uri = "ms-appx:///" + uri;

                    uri = new Windows.Foundation.Uri(uri);
                    var reference = storage.Streams.RandomAccessStreamReference.createFromUri(uri);
                    request.data.properties.thumbnail = reference;
                    request.data.setBitmap(reference);
                }
            


            // Handle click events from the Photo command
            document.getElementById("photo").addEventListener("click", function (e) {
                var camera = new capture.CameraCaptureUI();

                // Capture a photo and display the share UI
                camera.captureFileAsync(capture.CameraCaptureUIMode.photo).then(function (file) {
                    if (file != null) {
                        _photo = file;
                        dtm.showShareUI();
                    }
                });

            });

            // Handle click events from the Video command
            document.getElementById("video").addEventListener("click", function (e) {
                dtm.showShareUI();
            });



    },

    unload: function () {
        WinJS.Navigation.removeEventListener("datarequested", this.onDataRequested);
    }


    });
})();

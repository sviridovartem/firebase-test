'use strict';

// Initializes FriendlyChat.
function FriendlyChat() {

    // Shortcuts to DOM Elements.
    this.messageList = document.getElementById('messages');
    this.userPic = document.getElementById('user-pic');
    this.userName = document.getElementById('user-name');


    this.initFirebase();
}

// Sets up shortcuts to Firebase features and initiate firebase auth.
FriendlyChat.prototype.initFirebase = function () {
    this.auth = firebase.auth();
    this.database = firebase.database();
    this.storage = firebase.storage();
    // Initiates Firebase auth and listen to auth state changes.
    this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};


// Loads chat messages history and listens for upcoming ones.
FriendlyChat.prototype.loadMessages = function () {
    // Reference to the /messages/ database path.

    var ModelName = {
        m911: "911",
        m718: "718",
        mPanamera: "Panamera",
        mMacan: "Macan",
        mCayenne: "Cayenne"
    }
    const modelName = ModelName.m911;


    this.messagesRef = this.database.ref('models/' + modelName);
    // Make sure we remove all previous listeners.
    this.messagesRef.off();

    // Loads the last 12 messages and listen for new ones.
    var setMessage = function (data) {
        //debugger;
        var val = data.val();

        this.displayMessage(data.key, modelName);//, val.name, val.text, val.photoUrl, val.imageUrl
    }.bind(this);
    this.messagesRef.on('child_added', setMessage); //.limitToLast(5)
    this.messagesRef.on('child_changed', setMessage);//.limitToLast(5)
};


// Triggers when the auth state change for instance when the user signs-in or signs-out.
FriendlyChat.prototype.onAuthStateChanged = function (user) {
    if (user) {
        this.loadMessages();
    } else { // User is signed out!
        // Hide user's profile and sign-out button.
        this.userName.setAttribute('hidden', 'true');
        this.userPic.setAttribute('hidden', 'true');
    }
};


// Template for messages.
FriendlyChat.MESSAGE_TEMPLATE =
    '<div class="message-container mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-desktop">' +
    '<div class="spacing"><div class="pic"></div></div>' +
    '<div class="message"></div>' +
    '<div class="name"></div>' +
    '</div>';

// Displays a Message in the UI.
FriendlyChat.prototype.displayMessage = function (key, model_name) {
    // , name, text, picUrl, imageUri

    var div = document.getElementById(key);
    // If an element for that message does not exists yet we create it.
    if (!div) {
        var container = document.createElement('div');
        container.innerHTML = FriendlyChat.MESSAGE_TEMPLATE;
        div = container.firstChild;
        div.setAttribute('id', key);
        this.messageList.appendChild(div);
    }
    // if (picUrl) {
    //   div.querySelector('.pic').style.backgroundImage = 'url(' + picUrl + ')';
    // }
    div.querySelector('.name').textContent = key;
    var messageElement = div.querySelector('.message');
    if (model_name) { // If the message is text.
        messageElement.textContent = model_name;
        // Replace all line breaks by <br>.
        messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
        // } else if (imageUri) { // If the message is an image.
        //     var image = document.createElement('img');
        //     image.addEventListener('load', function () {
        //         this.messageList.scrollTop = this.messageList.scrollHeight;
        //     }.bind(this));
        //     this.setImageUrl(imageUri, image);
        //     messageElement.innerHTML = '';
        //     messageElement.appendChild(image);
    }
    // Show the card fading-in.
    setTimeout(function () {
        div.classList.add('visible')
    }, 1);
    this.messageList.scrollTop = this.messageList.scrollHeight;
};

window.onload = function () {
    window.friendlyChat = new FriendlyChat();
};

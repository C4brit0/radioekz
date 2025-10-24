// =============================================
// INITIALIZATION AND ELEMENT REMOVAL
// =============================================

// Remove video resize buttons
const resizes = document.getElementById("resize-video-smaller");
const resizel = document.getElementById("resize-video-larger");
if (resizes) resizes.remove();
if (resizel) resizel.remove();

// Hide main container temporarily
document.querySelector(".container-fluid").style.display = "none";

// =============================================
// BANNER AND CREDITS
// =============================================

// Add scrolling banner if enabled
if (typeof scrollingBannerEnabled !== "undefined" && scrollingBannerEnabled) {
    $("#motdwrap").prepend($('<div class="banner-slideshow"><div class="mover-1"></div></div>'));
}

// Add theme credits
$(".credit").append($('<p class="text-muted credit">Theme by Eskizo, para ver videos do gdrive <a href="https://files.catbox.moe/iiehcq.png" target="_blank" rel="noreferrer noopener">Clique aqui</a></p>'));

// =============================================
// MAIN LAYOUT STRUCTURE
// =============================================

// Create main content structure
$("#mainpage").prepend($('<div id="content-wrap">'));
$("#content-wrap").prepend($('<div id="rightcontent">'));
$("#content-wrap").prepend($('<div id="leftcontent">'));

// Video container setup
$("<div id='video-container'>").prependTo($("#leftcontent"));
$("#videowrap").prependTo($("#video-container"));
$('<div id="channel-content">').appendTo($("#leftcontent"));

// Move elements to left content area
$("#announcements").appendTo($("#channel-content"));
$("#drinkbar").appendTo($("#channel-content"));
$("#motdrow").appendTo($("#channel-content"));
$("#controlsrow").appendTo($("#channel-content"));
$("#playlistrow").appendTo($("#channel-content"));
$("#sitefooter").appendTo($("#channel-content"));
$("#footer").appendTo($("#channel-content"));
$("#leftcontent").prepend($("#pollwrap"));

// Move chat elements to right content area
$("#chatheader").appendTo($("#rightcontent"));
$("#userlist").appendTo($("#rightcontent"));
$("#messagebuffer").appendTo($("#rightcontent"));

// Chat form setup
const formLine = document.querySelector("div#chatwrap > form");
if (formLine) {
    formLine.setAttribute("id", "formline");
    $("#formline").appendTo($("#rightcontent"));
}

$("#leftcontrols").appendTo($("#rightcontent"));

// Current video title setup
$("#rightcontent").prepend($("<div id='currenttitlewrap'>"));
$("#videowrap-header").prependTo($("#currenttitlewrap"));

// Clone and adjust current title
const nodecurrenttitle = document.getElementById("currenttitle");
const pagewrap = document.getElementById("wrap");
if (pagewrap) {
    pagewrap.setAttribute("style", "padding-bottom: 0px;");
}

// =============================================
// CHAT CONFIGURATION AND RESPONSIVENESS
// =============================================

const chatline = document.getElementById("chatline");

/**
 * Adjusts chat position for mobile devices
 */
function chatPosition(e) {
    if (e.matches) {
        // Mobile layout
        $("#rightcontent").appendTo($("#leftcontent"));
        $("#channel-content").appendTo($("#leftcontent"));
        $("#footer").appendTo($("#leftcontent"));
        
        // Scroll to top when chat is clicked
        if (document.getElementById("chatline")) {
            document.getElementById("chatline").onclick = function() {
                var scrollCount = 0;
                var scrollInterval = setInterval(() => {
                    document.documentElement.scrollTop = 0;
                    if (++scrollCount == 10) {
                        window.clearInterval(scrollInterval);
                    }
                }, 50);
            };
        }
        
        // Update viewport height variable
        setInterval(() => {
            document.documentElement.style.setProperty("--vh", window.innerHeight / 100 + "px");
        }, 20);
    } else {
        // Desktop layout
        $("#rightcontent").appendTo($("#content-wrap"));
        document.documentElement.style.setProperty("--vh", window.innerHeight / 100 + "px");
    }
}

// Configure chat input
if (chatline) {
    chatline.removeAttribute("placeholder");
    chatline.setAttribute("placeholder", "Send a message");
    chatline.setAttribute("spellcheck", "false");
}

// Update viewport height regularly
setInterval(() => {
    document.documentElement.style.setProperty("--vh", window.innerHeight / 100 + "px");
}, 20);

// Apply responsive behavior
var mediaQuery = window.matchMedia("(max-width: 768px)");
chatPosition(mediaQuery);
mediaQuery.addEventListener("change", chatPosition);

// =============================================
// ADDITIONAL CONTROLS AND BUTTONS
// =============================================

// Create jump to current item button
const jumpBtn = document.createElement("button");
jumpBtn.innerHTML = "Scroll to current item";
jumpBtn.setAttribute("id", "jump-btn");
jumpBtn.setAttribute("class", "btn");
jumpBtn.onclick = function() {
    if (typeof window.scrollQueue === "function") {
        window.scrollQueue();
    }
};

const rightControls = document.getElementById("rightcontrols");
if (rightControls && rightControls.children.length > 1) {
    rightControls.insertBefore(jumpBtn, rightControls.children[1]);
}

// =============================================
// AFK (AWAY FROM KEYBOARD) SYSTEM
// =============================================

var VOL_AFK = false;
var FOCUS_AFK = false;

// Periodically check if user is AFK
setInterval(() => {
    if (!VOL_AFK && !FOCUS_AFK) {
        $("#userlist").find("span[class^=userlist]").each(function() {
            if ($(this).html() == CLIENT.name && $(this).css("font-style") == "italic") {
                socket.emit("chatMsg", { msg: "/afk" });
            }
        });
    }
}, 500);

// Window focus/blur events for AFK
window.addEventListener("focus", () => {
    if (FOCUS_AFK && VOL_AFK) {
        socket.emit("chatMsg", { msg: "/afk" });
        FOCUS_AFK = false;
        VOL_AFK = false;
    }
});

window.addEventListener("blur", () => {
    if (!FOCUS_AFK && !VOL_AFK) {
        socket.emit("chatMsg", { msg: "/afk" });
        FOCUS_AFK = true;
        VOL_AFK = true;
    }
});

// =============================================
// PAGE INITIALIZATION
// =============================================

$(document).ready(function() {
    // cytu.be specific configurations
    if (window.location.host == "cytu.be") {
        if (typeof channelName !== "undefined") {
            $(".navbar-brand").html(channelName);
        }
        if (typeof faviconUrl !== "undefined") {
            $('<link id="chanfavicon" href="' + faviconUrl + '" type="image/x-icon" rel="shortcut icon" />').appendTo("head");
        }
    }
    
    // Add Google Fonts
    $('<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Ubuntu">').appendTo("head");
    $('<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Quicksand">').appendTo("head");
    $('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Caveat">').appendTo("head");
});

// =============================================
// CUSTOM BUTTONS AND CONTROLS
// =============================================

// CSS Preview button
$('<button class="btn btn-primary" id="cs-csspreview">Preview CSS</button>')
    .appendTo("#cs-csseditor")
    .on("mousedown", function() {
        document.getElementById("channeloptions").style.visibility = "hidden";
        document.getElementById("cs-csseditor").style.visibility = "hidden";
        document.getElementById("cs-csspreview").style.visibility = "visible";
    })
    .on("mouseout", function() {
        document.getElementById("channeloptions").style.visibility = "visible";
        document.getElementById("cs-csseditor").style.visibility = "visible";
    })
    .on("mouseup", function() {
        document.getElementById("channeloptions").style.visibility = "visible";
        document.getElementById("cs-csseditor").style.visibility = "visible";
    });

// AFK button
$('<button id="afk-btn" class="btn btn-default btn-sm">AFK</button>')
    .appendTo("#leftcontrols")
    .on("click", function() {
        socket.emit("chatMsg", { msg: "/afk" });
        VOL_AFK = !VOL_AFK;
    });

// Clear chat button
$('<button id="clear-btn" class="btn btn-default btn-sm">Clear</button>')
    .appendTo("#leftcontrols")
    .on("click", function() {
        socket.emit("chatMsg", { msg: "/clear" });
    });

// =============================================
// EMOTES PANEL SYSTEM
// =============================================

// Initialize emotes panel position
if (!localStorage.epFlTop || !localStorage.epFlLeft) {
    localStorage.epFlTop = 100;
    localStorage.epFlLeft = -15;
}

$('<div class="emotewrap" id="emotewrap" style="top: ' + localStorage.epFlTop + "px; left: " + localStorage.epFlLeft + 'px;">').appendTo($("#rightcontent"));

// Initialize emotes panel
if (!localStorage.epposition) {
    localStorage.epposition = 1;
    var emotespanel = $('<div id="emotespanel" class="ep__fixed" style="display:none" />').insertAfter("#userlist");
}

var emotespanel;
if (localStorage.epposition == 0) {
    emotespanel = $('<div id="emotespanel" class="ep__floating" style="display:none" />').appendTo($("#emotewrap"));
} else {
    emotespanel = $('<div id="emotespanel" class="ep__fixed" style="display:none" />').insertAfter("#userlist");
}

if (!localStorage.epIsOpen) {
    localStorage.epIsOpen = 0;
}

if (localStorage.epIsOpen == 1) {
    toggleDiv(emotespanel);
}

// Intersection Observer for queue visibility
let observer = new IntersectionObserver(observerCallback);

function observerCallback() {
    toggleDiv("#queue");
}

// =============================================
// UTILITY FUNCTIONS
// =============================================

/**
 * Toggle element visibility
 */
function toggleDiv(element) {
    if ($(element).css("display") == "none") {
        $(element).show();
    } else {
        $(element).hide();
    }
}

/**
 * Insert text into chat input
 */
function insertText(text) {
    $("#chatline").val($("#chatline").val() + text).focus();
}

// =============================================
// EMOTES AUTOCOMPLETE SYSTEM
// =============================================

var autocompleteArr = [];

/**
 * Initialize emotes panel
 */
function emotesPanel() {
    emotespanel.removeClass("row");
    document.querySelector("#emotespanel").replaceChildren();
    
    const len = CHANNEL.emotes.length;
    
    if (len < 1) {
        // No emotes available
        emotespanel.addClass("row");
        makeAlert("No emotes available", "Ask channel administrator. This panel will update every second until an emote is found.").appendTo(emotespanel);
        
        if (!document.querySelector("#content-wrap").contains(document.querySelector("#needpw"))) {
            $("#needpw").appendTo($("#content-wrap"));
        }
        
        console.log("No emotes found, reloading in 1 second");
        setTimeout(() => {
            emotesPanel();
        }, 1000);
    } else {
        // Load available emotes
        for (let i in CHANNEL.emotes) {
            $("<img onclick=\"insertText('" + CHANNEL.emotes[i].name + " ')\" />")
                .attr({
                    src: CHANNEL.emotes[i].image,
                    title: CHANNEL.emotes[i].name
                })
                .appendTo(emotespanel);
                
            autocompleteArr.push({
                name: CHANNEL.emotes[i].name,
                image: CHANNEL.emotes[i].image
            });
        }
        
        // Sort emotes and setup autocomplete
        autocompleteArr.sort((a, b) => a.name.localeCompare(b.name));
        
        if (window.matchMedia("(max-width: 768px)").matches) {
            observer.observe(document.querySelector("#rightpane-inner").children[5]);
        } else {
            autocomplete(document.getElementById("chatline"), autocompleteArr);
        }
    }
}

/**
 * Switch between fixed and floating emotes panel
 */
function switchEp() {
    const emotesPanel = document.querySelector("#emotespanel");
    
    if (localStorage.epposition == 1) {
        // Switch to floating
        emotesPanel.setAttribute("class", "ep__floating");
        $("#emotespanel").appendTo($("#emotewrap"));
        localStorage.epposition = 0;
        document.querySelector("#emotewrap").style.top = "100px";
        document.querySelector("#emotewrap").style.left = "-15px";
        localStorage.epFlTop = 100;
        localStorage.epFlLeft = -15;
    } else {
        // Switch to fixed
        emotesPanel.setAttribute("class", "ep__fixed");
        $("#emotespanel").insertAfter("#userlist");
        localStorage.epposition = 1;
    }
}

/**
 * Make element draggable
 */
function dragElement(element) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }
    
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }
    
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        localStorage.epFlTop = document.querySelector("#emotewrap").style.top.substring(
            0, 
            document.querySelector("#emotewrap").style.top.length - 2
        );
        localStorage.epFlLeft = document.querySelector("#emotewrap").style.left.substring(
            0, 
            document.querySelector("#emotewrap").style.left.length - 2
        );
    }
    
    const header = document.getElementById(element.id + "header");
    if (header) {
        header.onmousedown = dragMouseDown;
    } else {
        element.onmousedown = dragMouseDown;
    }
}

/**
 * Autocomplete functionality for chat input
 */
function autocomplete(input, arr) {
    var currentFocus;
    var originalValue = "";
    
    function removeActive(items) {
        if (!items) return false;
        for (var i = 0; i < items.length; i++) {
            items[i].classList.remove("autocomplete-active");
        }
    }
    
    function closeAllLists(exceptElement) {
        var items = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < items.length; i++) {
            if (exceptElement != items[i] && exceptElement != input) {
                items[i].parentNode.removeChild(items[i]);
            }
        }
    }
    
    input.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        closeAllLists();
        
        if (!val) return false;
        currentFocus = -1;
        
        a = document.createElement("DIV");
        a.setAttribute("id", "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        a.style.bottom = `${$("#rightcontent > form").outerHeight() + $("#leftcontrols").outerHeight()}px`;
        this.parentNode.appendChild(a);
        $("#autocomplete-list").insertBefore(document.querySelectorAll("form")[1]);
        
        var currentCommand = document.getElementById("chatline").value.match(/(?<!\S)\/\S*$/gim)?.toString();
        var searchTerm = currentCommand?.substring(1, currentCommand.length);
        originalValue = document.getElementById("chatline").value;
        
        for (i = 0; i < arr.length; i++) {
            if (arr[i].name.substr(0, currentCommand?.length)?.toUpperCase() == currentCommand?.toUpperCase()) {
                b = document.createElement("DIV");
                b.innerHTML = "<strong>" + arr[i].name.substr(0, currentCommand?.length) + "</strong>";
                b.innerHTML += arr[i].name.substr(currentCommand?.length);
                b.innerHTML += "<input type='hidden' value='" + arr[i].name + "'>";
                b.innerHTML += "<img id='autocomplete-image' src='" + arr[i].image + "'>";
                b.addEventListener("click", function(e) {
                    const commandMatch = $("#chatline").val().match(/(?<!\S)\/\S*$/gim);
                    if (commandMatch) {
                        $("#chatline").val(
                            $("#chatline").val().substring(0, $("#chatline").val().length - commandMatch.toString().length) + 
                            this.getElementsByTagName("input")[0].value
                        );
                    }
                    closeAllLists();
                });
                a.appendChild(b);
            } else if (arr[i].name.substring(1, arr[i].name.length).indexOf(searchTerm) > -1) {
                var matchIndex = arr[i].name.indexOf(searchTerm);
                b = document.createElement("DIV");
                b.innerHTML = "<strong>/</strong>";
                b.innerHTML += arr[i].name.substring(1, matchIndex);
                b.innerHTML += "<strong>" + searchTerm + "</strong>";
                b.innerHTML += arr[i].name.substring(matchIndex + searchTerm?.length, arr[i].name.length);
                b.innerHTML += "<input type='hidden' value='" + arr[i].name + "'>";
                b.innerHTML += "<img id='autocomplete-image' src='" + arr[i].image + "'>";
                b.addEventListener("click", function(e) {
                    const commandMatch = $("#chatline").val().match(/(?<!\S)\/\S*$/gim);
                    if (commandMatch) {
                        $("#chatline").val(
                            $("#chatline").val().substring(0, $("#chatline").val().length - commandMatch.toString().length) + 
                            this.getElementsByTagName("input")[0].value
                        );
                    }
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    
    input.addEventListener("keydown", function(e) {
        var items = document.getElementById("autocomplete-list");
        if (items) items = items.getElementsByTagName("div");
        
        if (e.keyCode == 40) { // Down arrow
            e.preventDefault();
            currentFocus++;
            removeActive(items);
            if (items && items[currentFocus]) {
                items[currentFocus].classList.add("autocomplete-active");
                items[currentFocus].scrollIntoViewIfNeeded(false);
                const commandMatch = originalValue.match(/(?<!\S)\/\S*$/gim);
                if (commandMatch && items[currentFocus].querySelector("input")) {
                    $("#chatline").val(
                        originalValue.substring(0, originalValue.length - commandMatch.toString().length) + 
                        items[currentFocus].querySelector("input").getAttribute("value")
                    );
                }
            }
        } else if (e.keyCode == 38) { // Up arrow
            e.preventDefault();
            currentFocus--;
            removeActive(items);
            if (items && items[currentFocus]) {
                items[currentFocus].classList.add("autocomplete-active");
                items[currentFocus].scrollIntoViewIfNeeded(false);
                const commandMatch = originalValue.match(/(?<!\S)\/\S*$/gim);
                if (commandMatch && items[currentFocus].querySelector("input")) {
                    $("#chatline").val(
                        originalValue.substring(0, originalValue.length - commandMatch.toString().length) + 
                        items[currentFocus].querySelector("input").getAttribute("value")
                    );
                }
            }
        } else if (e.keyCode == 13 || e.keyCode == 9) { // Enter or Tab
            closeAllLists();
        }
    });
    
    document.addEventListener("click", function(e) {
        closeAllLists(e.target);
    });
}

// =============================================
// FINAL CONTROL SETUP
// =============================================

// Initialize emotes panel
emotesPanel();

// Remove original emote list button and setup new buttons
$("#emotelistbtn").remove();

// Configure new poll button with SVG
$("#newpollbtn").html('<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#FFFFFF" height="800px" width="800px" version="1.1" id="Capa_1" viewBox="0 0 490.4 490.4" xml:space="preserve"><path d="M17.2,251.55c-9.5,0-17.2,7.7-17.2,17.1v179.7c0,9.5,7.7,17.2,17.2,17.2h113c9.5,0,17.1-7.7,17.1-17.2v-179.7 c0-9.5-7.7-17.1-17.1-17.1L17.2,251.55L17.2,251.55z M113,431.25H34.3v-145.4H113V431.25z"/><path d="M490.4,448.45v-283.7c0-9.5-7.7-17.2-17.2-17.2h-113c-9.5,0-17.2,7.7-17.2,17.2v283.6c0,9.5,7.7,17.2,17.2,17.2h113 C482.7,465.55,490.4,457.85,490.4,448.45z M456.1,431.25h-78.7v-249.3h78.7L456.1,431.25L456.1,431.25z"/> <path d="M301.7,465.55c9.5,0,17.1-7.7,17.1-17.2V42.05c0-9.5-7.7-17.2-17.1-17.2h-113c-9.5,0-17.2,7.7-17.2,17.2v406.3 c0,9.5,7.7,17.2,17.2,17.2H301.7z M205.9,59.25h78.7v372h-78.7L205.9,59.25L205.9,59.25z"/></svg>');
$("#newpollbtn").attr("title", "Create new poll");

// Custom emotes button
var emotesbtn = $('<button id="emotes-btn" class="btn btn-sm btn-default" title="Display emotes panel"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#FFFFFF" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.507 13.941c-1.512 1.195-3.174 1.931-5.506 1.931-2.334 0-3.996-.736-5.508-1.931l-.493.493c1.127 1.72 3.2 3.566 6.001 3.566 2.8 0 4.872-1.846 5.999-3.566l-.493-.493zm-9.007-5.941c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5z"/></svg></button>')
    .prependTo("#leftcontrols")
    .on("click", function() {
        toggleDiv(emotespanel);
        if (localStorage.epIsOpen == 0) {
            localStorage.epIsOpen = 1;
        } else {
            localStorage.epIsOpen = 0;
        }
    });

// Reorganize buttons in interface
$("#emotes-btn").after($("#voteskip"));
$('<li><a onclick="switchEp()" style="cursor: pointer;">Switch EP</a></li>').appendTo(".navbar-nav");
$("#newpollbtn").prependTo($("#leftcontrols"));

// Enable dragging for emotes panel
dragElement(document.getElementById("emotewrap"));

// =============================================
// REPLY SYSTEM IN CHAT
// =============================================

const LOAD_IN_DELAY = 10;

/**
 * Process reply messages and replace emotes
 */
function processReplyMessage(message) {
    let processedMessage = message;
    
    // Replace emote codes with images
    if (/(?<!\S)\/\S*/gim.exec(message)) {
        processedMessage = message.replace(/(?<!\b)\/(\w+)/g, (match, emoteName) => {
            const emote = autocompleteArr.filter(e => e.name == `/${emoteName}`)[0];
            return emote ? `<img class="channel-emote" src="${emote.image}" title="/${emoteName}">` : match;
        });
    }
    
    return processedMessage.replace(/\[r\](.+?)\[\/r\]/, "").trim();
}

/**
 * Scroll to replied message
 */
function scrollToReply(pseudoId) {
    const messages = getAllMessages().filter(msg => msg.pseudoId == pseudoId);
    if (messages[0]) {
        $(messages[0].element)[0].scrollIntoView({ behavior: "smooth" });
        $(messages[0].element).delay(200)
            .animate({ backgroundColor: "#696969" }, 300)
            .animate({ backgroundColor: "transparent" }, 300);
    }
}

/**
 * Format timestamp
 */
function getTimeString(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return "[" + ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2) + "]";
}

/**
 * Sanitize message for pseudo ID generation
 */
function sanitizeMessageForPseudoID(message) {
    const replyMatch = message.match(/(?:.*?\[\/r\]\s+)(.+)/);
    if (replyMatch) {
        return replyMatch[1].split(" ")[0].substring(0, 12);
    }
    return message.split(" ")[0].substring(0, 12);
}

/**
 * Generate unique hash for messages
 */
function generateHash(username, message, timestamp) {
    const cleanMessage = message.replace(/\[r\](.+?)\[\/r\]/, "").trim();
    return md5(`${username.trim()}${cleanMessage}${timestamp.trim()}`).substring(0, 8);
}

/**
 * Get all chat messages
 */
function getAllMessages() {
    let messages = [];
    $("div#messagebuffer").children().each((index, element) => {
        if (!$(element).attr("class")?.includes("chat-msg-") || $(element).attr("class")?.includes("server")) {
            return;
        }
        
        const messageContent = $(element).find("span:not(.timestamp)").length > 1 ? 
            $(element).find("span:not(.timestamp)").last().html() : 
            $(element).find("span:not(.timestamp)").html();
            
        const username = $(element).attr("class").split("-")[2].split(" ")[0];
        
        messages.push({
            pseudoId: generateHash(username, messageContent, $(element).find("span.timestamp").text()),
            message: messageContent,
            username: username,
            element: element
        });
    });
    
    return messages;
}

/**
 * Get selected text
 */
function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

/**
 * Reply to message button handler
 */
function replyToButton(event) {
    const button = event.target;
    const messageContent = $(button).siblings().length > 1 ? 
        $(button).siblings().last().html() : 
        $(button).siblings().html();
        
    const username = button.parentNode.className?.split("-")[2]?.split(" ")[0];
    const pseudoId = generateHash(username, messageContent, $(button).siblings(".timestamp").html());
    
    const currentInput = $("#chatline").val().replace(/(?:.*?\[\/r\]\s+)/, "");
    
    if (sanitizeMessageForPseudoID(messageContent) != "") {
        $("#chatline").val(`[r]${pseudoId.trim()}[/r] ${currentInput}`).focus();
    }
}

/**
 * MD5 implementation for message hashing
 */
function md5(inputString) {
    // MD5 implementation remains the same as original
    // ... (keeping the original MD5 code for compatibility)
    var hc="0123456789abcdef";
    function rh(n) {var j,s="";for(j=0;j<=3;j++) s+=hc.charAt((n>>(j*8+4))&0x0F)+hc.charAt((n>>(j*8))&0x0F);return s;}
    function ad(x,y) {var l=(x&0xFFFF)+(y&0xFFFF);var m=(x>>16)+(y>>16)+(l>>16);return (m<<16)|(l&0xFFFF);}
    function rl(n,c) {return (n<<c)|(n>>>(32-c));}
    function cm(q,a,b,x,s,t) {return ad(rl(ad(ad(a,q),ad(x,t)),s),b);}
    function ff(a,b,c,d,x,s,t) {return cm((b&c)|((~b)&d),a,b,x,s,t);}
    function gg(a,b,c,d,x,s,t) {return cm((b&d)|(c&(~d)),a,b,x,s,t);}
    function hh(a,b,c,d,x,s,t) {return cm(b^c^d,a,b,x,s,t);}
    function ii(a,b,c,d,x,s,t) {return cm(c^(b|(~d)),a,b,x,s,t);}
    function sb(x) {
        var i;var nblk=((x.length+8)>>6)+1;var blks=new Array(nblk*16);for(i=0;i<nblk*16;i++) blks[i]=0;
        for(i=0;i<x.length;i++) blks[i>>2]|=x.charCodeAt(i)<<((i%4)*8);
        blks[i>>2]|=0x80<<((i%4)*8);blks[nblk*16-2]=x.length*8;return blks;
    }
    
    var i,x=sb(""+inputString),a=1732584193,b=-271733879,c=-1732584194,d=271733878,olda,oldb,oldc,oldd;
    
    for(i=0;i<x.length;i+=16) {olda=a;oldb=b;oldc=c;oldd=d;
        a=ff(a,b,c,d,x[i+0],7,-680876936);d=ff(d,a,b,c,x[i+1],12,-389564586);c=ff(c,d,a,b,x[i+2],17,606105819);
        b=ff(b,c,d,a,x[i+3],22,-1044525330);a=ff(a,b,c,d,x[i+4],7,-176418897);d=ff(d,a,b,c,x[i+5],12,1200080426);
        c=ff(c,d,a,b,x[i+6],17,-1473231341);b=ff(b,c,d,a,x[i+7],22,-45705983);a=ff(a,b,c,d,x[i+8],7,1770035416);
        d=ff(d,a,b,c,x[i+9],12,-1958414417);c=ff(c,d,a,b,x[i+10],17,-42063);b=ff(b,c,d,a,x[i+11],22,-1990404162);
        a=ff(a,b,c,d,x[i+12],7,1804603682);d=ff(d,a,b,c,x[i+13],12,-40341101);c=ff(c,d,a,b,x[i+14],17,-1502002290);
        a=gg(a,b=ff(b,c,d,a,x[i+15],22,1236535329),c,d,x[i+1],5,-165796510);d=gg(d,a,b,c,x[i+6],9,-1069501632);
        c=gg(c,d,a,b,x[i+11],14,643717713);b=gg(b,c,d,a,x[i+0],20,-373897302);a=gg(a,b,c,d,x[i+5],5,-701558691);
        d=gg(d,a,b,c,x[i+10],9,38016083);c=gg(c,d,a,b,x[i+15],14,-660478335);b=gg(b,c,d,a,x[i+4],20,-405537848);
        a=gg(a,b,c,d,x[i+9],5,568446438);d=gg(d,a,b,c,x[i+14],9,-1019803690);c=gg(c,d,a,b,x[i+3],14,-187363961);
        a=hh(a,b=gg(b,c,d,a,x[i+8],20,1163531501),c,d,x[i+5],4,-378558);d=hh(d,a,b,c,x[i+8],11,-2022574463);
        c=hh(c,d,a,b,x[i+11],16,1839030562);b=hh(b,c,d,a,x[i+14],23,-35309556);a=hh(a,b,c,d,x[i+1],4,-1530992060);
        d=hh(d,a,b,c,x[i+4],11,1272893353);c=hh(c,d,a,b,x[i+7],16,-155497632);b=hh(b,c,d,a,x[i+10],23,-1094730640);
        a=hh(a,b,c,d,x[i+13],4,681279174);d=hh(d,a,b,c,x[i+0],11,-358537222);c=hh(c,d,a,b,x[i+3],16,-722521979);
        a=ii(a,b=hh(b,c,d,a,x[i+6],23,76029189),c,d,x[i+9],6,-640364487);d=ii(d,a,b,c,x[i+12],11,-421815835);
        c=ii(c,d,a,b,x[i+15],16,530742520);b=ii(b,c,d,a,x[i+2],23,-995338651);a=ii(a,b,c,d,x[i+0],6,-198630844);
        d=ii(d,a,b,c,x[i+7],10,1126891415);c=ii(c,d,a,b,x[i+14],15,-1416354905);b=ii(b,c,d,a,x[i+5],21,-57434055);
        a=ii(a,b,c,d,x[i+12],6,1700485571);d=ii(d,a,b,c,x[i+3],10,-1894986606);c=ii(c,d,a,b,x[i+10],15,-1051523);
        a=ii(a,b=ii(b,c,d,a,x[i+1],21,-2054922799),c,d,x[i+8],6,1873313359);d=ii(d,a,b,c,x[i+15],10,-30611744);
        c=ii(c,d,a,b,x[i+6],15,-1560198380);b=ii(b,c,d,a,x[i+13],21,1309151649);a=ii(a,b,c,d,x[i+4],6,-145523070);
        d=ii(d,a,b,c,x[i+11],10,-1120210379);c=ii(c,d,a,b,x[i+2],15,718787259);b=ii(b,c,d,a,x[i+9],21,-343485551);
        a=ad(a,olda);b=ad(b,oldb);c=ad(c,oldc);d=ad(d,oldd);
    }
    return rh(a)+rh(b)+rh(c)+rh(d);
}

// =============================================
// CHAT MESSAGE PROCESSING
// =============================================

// Handle incoming chat messages with reply system
socket.on("chatMsg", function(data) {
    const allMessages = getAllMessages();
    const messageHash = generateHash(data.username, data.msg, getTimeString(data.time));
    const messageElement = allMessages.filter(msg => msg.pseudoId == messageHash)[0]?.element;
    
    if (/\[r\](.+?)\[\/r\]/g.exec(data.msg)) {
        const replyId = data.msg.replace(/.*\[r\](.*?)\[\/r\].*/, "$1")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&amp;/g, "&");
            
        const repliedMessage = allMessages.filter(msg => msg.pseudoId == replyId);
        const sanitizedReplyId = replyId.replace(/[<>"'&]/g, function(char) {
            switch(char) {
                case "<": return "&lt;";
                case ">": return "&gt;";
                case '"': return "&quot;";
                case "'": return "&#39;";
                case "&": return "&amp;";
                default: return char;
            }
        });
        
        if (repliedMessage[0]?.message) {
            setTimeout(() => {
                if ($(messageElement).find(".username").length != 0) {
                    $(messageElement).find("span.timestamp").next().next().after(
                        `<div onclick="scrollToReply('${sanitizedReplyId}')" class="reply">
                            <span class="reply-header"></span>
                            <span class="reply-msg"></span>
                        </div>`
                    );
                } else {
                    $(messageElement).find("span.timestamp").after(
                        `<div onclick="scrollToReply('${sanitizedReplyId}')" class="reply">
                            <span class="reply-header"></span>
                            <span class="reply-msg"></span>
                        </div>`
                    );
                }
                
                $(messageElement).find(".reply-header").html(`Replying to ${repliedMessage[0].username}:`);
                $(messageElement).find(".reply-msg").html(repliedMessage[0].message.replace(/\[r\](.+?)\[\/r\]/, "").trim());
                $(messageElement).children().last().html(data.msg.replace(/\[r\](.+?)\[\/r\]/, "").trim());
            }, 10);
            
            setTimeout(() => {
                $("#messagebuffer").animate({scrollTop: $("#messagebuffer").height() + 100000}, "fast");
            }, 20);
        } else {
            setTimeout(() => {
                $(messageElement).children().last().html(processReplyMessage(data.msg));
            }, 10);
        }
        
        $(messageElement).find(".timestamp").after('<button onclick="replyToButton(event)" title="Reply" class="reply-button"><i class="reply-icon"></i></button>');
    } else {
        if (data.username != "[server]") {
            $(messageElement).find(".timestamp").after('<button onclick="replyToButton(event)" title="Reply" class="reply-button"><i class="reply-icon"></i></button>');
        }
    }
});

// Process existing messages on page load
$(document).ready(() => {
    const allMessages = getAllMessages();
    
    $("div#messagebuffer").children().each((index, element) => {
        if (!$(element).attr("class")?.includes("chat-msg-") || $(element).attr("class")?.includes("server")) {
            return;
        }
        
        const messageContent = $(element).find("span:not(.timestamp)").length > 1 ? 
            $(element).find("span:not(.timestamp)").last().html() : 
            $(element).find("span:not(.timestamp)").html();
            
        if (/\[r\](.+?)\[\/r\]/g.exec(messageContent)) {
            const replyId = messageContent.replace(/.*\[r\](.*?)\[\/r\].*/, "$1")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&amp;/g, "&");
                
            const repliedMessage = allMessages.filter(msg => msg.pseudoId == replyId);
            const sanitizedReplyId = replyId.replace(/[<>"'&]/g, function(char) {
                switch(char) {
                    case "<": return "&lt;";
                    case ">": return "&gt;";
                    case '"': return "&quot;";
                    case "'": return "&#39;";
                    case "&": return "&amp;";
                    default: return char;
                }
            });
            
            if (repliedMessage[0]?.message) {
                if ($(element).find(".username").length != 0) {
                    $(element).find("span.timestamp").next().after(
                        `<div onclick="scrollToReply('${sanitizedReplyId}')" class="reply">
                            <span class="reply-header"></span>
                            <span class="reply-msg"></span>
                        </div>`
                    );
                } else {
                    $(element).find("span.timestamp").after(
                        `<div onclick="scrollToReply('${sanitizedReplyId}')" class="reply">
                            <span class="reply-header"></span>
                            <span class="reply-msg"></span>
                        </div>`
                    );
                }
                
                $(element).find("span.reply-header").html(`Replying to ${repliedMessage[0].username}:`);
                $(element).find("span.reply-msg").html(repliedMessage[0].message.replace(/\[r\](.+?)\[\/r\]/, "").trim());
                $(element).children().last().html(messageContent.replace(/\[r\](.+?)\[\/r\]/, "").trim());
                
                setTimeout(() => {
                    $("#messagebuffer").animate({scrollTop: $("#messagebuffer").height() + 100000}, "fast");
                }, 20);
            } else {
                $(element).children().last().html(processReplyMessage(messageContent));
            }
        }
        
        if ($(element).attr("class")?.includes("chat-msg-")) {
            $(element).find(".timestamp").after('<button onclick="replyToButton(event)" title="Reply" class="reply-button"><i class="reply-icon"></i></button>');
        }
    });
});

console.log("penny9squad custom script loaded successfully!");

// =============================================
// SOM DE NOTIFICAÇÃO PARA PMs - APENAS PARA QUEM RECEBE
// =============================================

console.log('🔊 Sistema de som de PM (apenas receptor) carregado!');

// Criar elemento de áudio
const pmSound = new Audio('https://www.myinstants.com/media/sounds/notfy.mp3');
pmSound.volume = 0.7;

// Variável para controlar se já tocou o som
let lastPMSoundTime = 0;
const SOUND_COOLDOWN = 2000;

// Função para tocar som de PM
function playPMSound() {
    const now = Date.now();
    
    if (now - lastPMSoundTime < SOUND_COOLDOWN) {
        console.log('⏳ Som em cooldown...');
        return;
    }
    
    console.log('🔔 Tocando som de notificação de PM');
    
    pmSound.play().catch(error => {
        console.log('❌ Erro ao tocar som:', error);
    });
    
    lastPMSoundTime = now;
}

// Ouvir novas mensagens PM - FILTRAR APENAS PARA QUEM RECEBE
socket.on('pm', function(data) {
    console.log('💌 Evento PM recebido:', data);
    
    // Verificar se a mensagem é para o usuário atual
    // O cytu.be geralmente envia PMs onde 'data.to' é o usuário atual
    // ou 'data.from' é quem enviou e a mensagem é para o usuário atual
    
    const currentUser = CLIENT.name; // Nome do usuário atual no cytu.be
    
    // Se a mensagem é dirigida ao usuário atual
    if (data.to === currentUser || 
        (data.msg && data.msg.includes(currentUser)) ||
        // Se não tem 'to' especificado, assume que é para o usuário atual
        (!data.to && data.from !== currentUser)) {
        
        console.log('🎯 PM destinada a mim - tocando som');
        
        // Tocar som apenas se a PM não estiver focada/ativa
        const currentPM = document.querySelector('.pm-panel.panel-default');
        if (!currentPM || !currentPM.querySelector('.panel-heading')?.textContent.includes(data.from)) {
            playPMSound();
        } else {
            console.log('🔇 PM já está em foco - som silenciado');
        }
    } else {
        console.log('🔇 PM não é para mim - ignorando som');
    }
});

// Método alternativo mais seguro
socket.on('chatMsg', function(data) {
    // Verificar se é uma PM (mensagens privadas geralmente têm formato diferente)
    if (data.pm || data.private || data.msg?.startsWith('/pm ') || data.msg?.includes('(PM)')) {
        console.log('💬 Mensagem de chat com possível PM:', data);
        
        // Lógica adicional se necessário
    }
});

console.log('✅ Sistema de som de PM (receptor apenas) ativo!');

// Adicione isto ao seu JS
document.addEventListener('DOMContentLoaded', function() {
    const accountBtn = document.querySelector('#account-btn, .account-button, [href*="account"]');
    if (accountBtn) {
        accountBtn.remove();
    }
});

(function () {
  'use strict';
 
  const MIN = 0;
  const MAX = 999;

function sendRoll() {
  const input = document.querySelector("#chatline");
  if (!input || !window.socket) return false;

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const msg = input.value.trim();

      if (msg.toLowerCase().startsWith("/roll")) {
        e.preventDefault(); // impede envio original

        // Gera número aleatório entre MIN e MAX (presumo que você já defina MIN e MAX)
        const num = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
        const numStr = num.toString();

        // Emite o resultado com o emote de dado (🎲). Ajuste se você usa um emote custom.
        socket.emit("chatMsg", { msg: `[code]🎲 Rolada ${num}[/code]` });

        // DEBUG (opcional): ver no console qual número foi gerado
        console.log("roll =>", numStr);

        // --- DETECÇÃO ---
        // 1) triplo: somente se for exatamente 3 dígitos iguais (ex: "333")
        if (numStr.length === 3 && /^(\d)\1\1$/.test(numStr)) {
          setTimeout(() => socket.emit("chatMsg", { msg: "%%TRIPLOS PRIMATA%%🙈🙉🙊" }), 80);
        }
        // 2) duplo: se for 2 dígitos (ex: "44") OU se for 3 dígitos e os 2 últimos forem iguais (ex: "433")
        else if (
          (numStr.length === 2 && /^(\d)\1$/.test(numStr)) ||
          (numStr.length === 3 && /(\d)\1$/.test(numStr))
        ) {
          setTimeout(() => socket.emit("chatMsg", { msg: "`DUPLOS!!`👍" }), 80);
        }

        // limpa o input
        input.value = "";
      }
    }
  }, true);

  console.log("Roll inicializado!");
  return true;
}

function waitForReady() {
    if ((document.readyState === "complete" || document.readyState === "interactive") &&
        window.socket && window.CLIENT) {
      sendRoll();
    } else {
      setTimeout(waitForReady, 500);
    }
  }
 
  waitForReady();
})();
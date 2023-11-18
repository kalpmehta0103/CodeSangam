var index = 0;
var colour = ['color_family', 'color_other', 'color_date', 'color_trip'];
var img_src = ['../Image/family_homepage.png', '../Image/other_homepage.png', '../Image/date.png', '../Image/trip_homepage.png']
var texts = ["with Home Mates", "with Others", "on Date", "on Trip"]

var img = document.querySelector(".col-lg-6 img");
var text = document.querySelector(".col-lg-6 span h2");

for(var j = 1; j < document.querySelectorAll('button').length; j++) {
    document.querySelectorAll('button')[j].addEventListener('click', function () {
        var buttonClicked =this;
        changeHomePage(this.textContent.slice(0,1).toLowerCase())
    })
}

function changeHomePage(character) {
    window.location.href = "/html/homepage.html"
    switch (character) {
        case "l":
            window.location.href = "/login";
            break;
        case "s":
            window.location.href = "/signup";
            break;
        default:
            window.location.href = "/signup";
            break;
       
    }
}
var i = 0;
setInterval(function () {
    text.classList.add(colour[i]);
    text.innerHTML = texts[i];
    img.src = img_src[i];
    setTimeout(function () {
        text.classList.remove(colour[i]);
        i = (i+1)%4;
    }, 2000)
}, 2000);

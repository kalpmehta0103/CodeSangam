var images = ['../Image/login_image.webp', '../Image/Login_img.jpg', '../Image/Login_img2.jpg', '../Image/Login_img3.jpg']

var img = document.querySelector('.text-center img')

buttons = document.querySelectorAll('button');

for(var i = 1; i < buttons.length; i++) {
    document.querySelectorAll('button')[i].addEventListener("click", function () {
        buttonClicked = this;
        var text = this.textContent.slice(0,1).toLowerCase();
        changePage(text);
    })
}

function changePage(character) {
    window.location.href = "/login"
    switch (character) {
        case "h":
            window.location.href = "/";
            break;
        case "s":
            window.location.href = "/signup";
            break;
        default:
            break;
    }
}

var i = 0;
setInterval(function () {
    img.src = images[i];
    setTimeout(function () {
        i = (i + 1) % images.length;
    }, 1000)
}, 1000);
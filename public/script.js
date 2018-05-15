// Scroll to a certain element
function scrollToNextPage() {
    document.querySelector('#second-page').scrollIntoView({
      behavior: 'smooth'
    });
}

function fadeOut(e) {
    e.preventDefault();
    var link = document.getElementById("second-page").getAttribute("href");
    var element = document.getElementById("overlay");
    element.style.display = "block"
    element.style.opacity = 1;
}

function fadeIn(e) {
    e.preventDefault();
    document.getElementById('overlay').style.display = "block";
    document.getElementById('overlay').style.backgroundColor = "transparent"
}

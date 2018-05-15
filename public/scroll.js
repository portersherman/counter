// Scroll to a certain element
function scrollToNextPage() {
    document.querySelector('#second-page').scrollIntoView({
      behavior: 'smooth'
    });
}

function showOverlay() {
    document.getElementById("overlay").style.display = "block";
}

function hideOverlay() {
    document.getElementById("overlay").style.display = "none";
}

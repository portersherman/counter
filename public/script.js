// Scroll to a certain element
document.querySelector(".arrow-border").addEventListener("click", scroll);

function scroll() {
    document.querySelector('#second-page').scrollIntoView({
      behavior: 'smooth'
    });
}

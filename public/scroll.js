// Scroll to a certain element
function scrollToNextPage() {
    document.querySelector('#second-page').scrollIntoView({
      behavior: 'smooth'
    });
}

function fadeIn(e) {
    e.preventDefault();
    console.log(e)
    //document.querySelector('#overlay').style.backgroundColor = 'white'
    newLocation = event.href;
    $('body').css('display', 'none');
    $('body').fadeIn(500);
}

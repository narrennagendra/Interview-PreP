var modal = document.getElementById('registerModal');
var btn = document.getElementById("registerBtn");
var btnClose = document.getElementById("registerBtn2");
var playBtn = document.getElementById("playBtn");
var span = document.getElementsByClassName("close")[0];
var modalBtn = document.getElementsByClassName("modalBtn");
btn.onclick = function() {
    modal.style.display = "block";
}
btnClose.onclick = function() {
    modal.style.display = "none";
}
playBtn.onclick = function() {
    modal.style.display = "block";
}
span.onclick = function() {
    modal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
} 


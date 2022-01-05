const value = document.getElementsByClassName('value');

console.log(value);

for(var i = 0; i<value.length; i++) {

    if(value[i].textContent < 0) {
        value[i].style.color = "#e74c3c";
    }
    else value[i].style.color = "#2ecc71";
    
}
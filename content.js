window.addEventListener("load", main, false);

function main(){
    let previews, dbutton;
    var jsInitChecktimer = setInterval(checkLoaded, 111);

    function checkLoaded(){
        let previews = document.getElementsByClassName('preview');
        let dbutton = document.getElementsByClassName('btn-download')[0];
        console.log(dbutton)
        
        if(previews && dbutton){
            clearInterval(jsInitChecktimer);
            console.log(previews);
            previews[0].click();
            console.log(dbutton.href)
        }
    }
}
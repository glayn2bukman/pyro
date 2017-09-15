function changeImage(input) {
    try{
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                var img = document.getElementById("img");
                img.setAttribute("src", e.target.result)
            };

            reader.readAsDataURL(input.files[0]);
        }
    } catch(e){
        alert(e);
    }
}

function convert_figure_to_human_readable(figure)
// this is my initial conception of this function. am sure it can be made more efficient(not that it isnt!)
{
    var fig = (""+figure).split("");
    fig.reverse();
    
    var _fig = [];
    
    while (fig.length>0)
    {
        if (fig.length>3)
        {
            _fig = _fig.concat(  (fig.slice(0,3)).concat([","])   );
            fig = fig.slice(3, fig.length);
        }
        else
        {
            _fig = _fig.concat(fig);
            fig = []; // force termination of loop
        }
    }
    
    _fig.reverse();
    var human_readable = "";
    for (var i=0; i<_fig.length; i++) {human_readable += _fig[i];}
    return human_readable;
}

function get_estimate(color)
{
    // formular for estimating the CCT(Correlated Color Temperature)
    // source: www.ams.com/kor/content/download/251586/993227/version/2
    // you can also visit the site 
    //      <https://dsp.stackexchange.com/questions/8949/how-do-i-calculate-the-color-temperature-of-the-light-source-illuminating-an-ima> 
    // for a brief but detailed review
    
    var X=(-0.14282*color[0])+(1.54924*color[1])+(-0.95641*color[2]);
    var Y=(-0.32466*color[0])+(1.57837*color[1])+(-0.73191*color[2]);
    var Z=(-0.68202*color[0])+(0.77073*color[1])+(0.56332*color[2]);

    var x=X/(X+Y+Z); 
    var y=Y/(X+Y+Z);

    var n=(x-0.3320)/(0.1858-y);

    var CCT=449*n*n*n + 3525*n*n + 6823.3*n+5520.33;

    if (isNaN(CCT)){return "Too cold(<1000K)";}
    if (CCT<0) {return "1000 K (estimate)"}
    return convert_figure_to_human_readable(Math.round(CCT, 0))+" K"
}

function clicked(e){
    var img = document.getElementById('img');
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);

    var pixelData = canvas.getContext('2d').getImageData(e.clientX, e.clientY, 1, 1).data;

    swal({
      title: "Temperature",
      text: get_estimate(pixelData),//get_closest(hex),
      type: "info",
      confirmButtonColor: "#009494",
    });

}


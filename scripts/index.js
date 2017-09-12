COLOR_TEMPERATURES = { // all temperatures in K
	'c7d8ff': 10600, 'ffc184': 3400, 'dde6ff': 8400, 'a2c0ff': 26200, 'ffa54f': 2600, 'ff3800': 1000, 
	'fff0e9': 5800, 'ffd9b6': 4400, 'ccdbff': 10000, 'b5cdff': 14400, 'a0bfff': 29200, 'ffe4ce': 5000, 
	'c6d8ff': 10800, 'ff7e00': 1800, 'b9d0ff': 13200, 'abc7ff': 18200, 'b7cfff': 13600, 'cedcff': 9800, 
	'a2c1ff': 25800, 'ffd5ad': 4200, 'dae4ff': 8600, 'ff932c': 2200, 'ffeee3': 5600, 'b0caff': 16000, 
	'bcd1ff': 12600, 'bed2ff': 12200, 'f9f6ff': 6800, 'afc9ff': 16600, 'acc7ff': 18000, 'f5f3ff': 7000, 
	'b8cfff': 13400, 'ff7300': 1600, 'd3e0ff': 9200, 'edefff': 7400, 'a9c5ff': 19800, '9fbfff': 29800, 
	'a1c0ff': 27600, 'ff9d3f': 2400, 'c0d4ff': 11800, 'd8e3ff': 8800, 'a8c5ff': 20200, 'e0e7ff': 8200, 
	'aec8ff': 17000, 'bbd1ff': 12800, 'a8c4ff': 20400, 'fef9ff': 6600, 'c2d5ff': 11400, 'cadaff': 10200, 
	'cfddff': 9600, 'a3c2ff': 24000, 'b4ccff': 14600, 'ffb46b': 3000, 'fff3ef': 6000, 'f0f1ff': 7200, 
	'a5c3ff': 22600, 'ffbb78': 3200, 'aec9ff': 16800, 'b3ccff': 15000, 'bdd2ff': 12400, 'd1dfff': 9400, 
	'ffcc99': 3800, 'ff8912': 2000, 'c1d4ff': 11600, 'ffe8d5': 5200, 'abc6ff': 18400, 'bad0ff': 13000, 
	'ffddbe': 4600, 'a6c3ff': 22000, 'a3c1ff': 25000, 'c9d9ff': 10400, 'a5c2ff': 22800, 'c4d7ff': 11000, 
	'ffad5e': 2800, 'fff8fb': 6400, 'b1caff': 15800, 'b2cbff': 15400, 'fff5f5': 6200, 'e6ebff': 7800, 
	'bfd3ff': 12000, 'a4c2ff': 23800, 'ffe1c6': 4800, 'adc8ff': 17400, 'c3d6ff': 11200, 'e9edff': 7600, 
	'aac6ff': 19000, 'e3e9ff': 8000, 'b7ceff': 13800, 'ffc78f': 3600, 'b6ceff': 14000, 'a7c4ff': 21200, 
	'a9c6ff': 19200, 'd6e1ff': 9000, 'ff6500': 1400, 'ffd1a3': 4000, 'ff5300': 1200, 'a0c0ff': 27800, 
	'ffebdc': 5400}

function changeImage(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var img = document.getElementById("img");
            img.setAttribute("src", e.target.result)
        };

        reader.readAsDataURL(input.files[0]);
    }
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return componentToHex(r) + componentToHex(g) + componentToHex(b); /* hex color does not have the # to match
                                                                         our color scheme in COLOR_TEMPERATURES
                                                                      */
}

function get_closest(color)
{
    var _r = eval("0x"+color[0]+color[1]); 
    var _g = eval("0x"+color[2]+color[3]);
    var _b = eval("0x"+color[4]+color[5]);

    // vars to update while looking for closes color
    tmp = [255,255,255]; 
    _color = null; 
    temp = null;

    for (var c in COLOR_TEMPERATURES) {
      if (COLOR_TEMPERATURES.hasOwnProperty(c)) {
        // logic goes here...

        var _c_ = COLOR_TEMPERATURES[c];

        if (c===color){
            _color = c; 
            temp = _c_;
            console.log("******");
            break ;   
        }
        var diff = [Math.abs(_r-eval('0x'+c[0]+c[1])), 
                Math.abs(_g-eval('0x'+c[2]+c[3])), 
                Math.abs(_b-eval('0x'+c[4]+c[5]))
               ];
               
        if (Math.min(...diff) < Math.min(...tmp)){
            tmp = diff;
            _color = c; 
            temp = _c_;
        }
        if (Math.min(...diff) == Math.min(...tmp))
            if (Math.max(...diff) < Math.max(...tmp)){
                tmp = diff; 
                _color = c; 
                temp = _c_;
            }
        
      }
    }

    if (Math.max(...tmp)>100) {return temp+' (large estimate)';}
    else{ return temp;}

}

function clicked(e){
    var img = document.getElementById('img');
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);

    var pixelData = canvas.getContext('2d').getImageData(e.clientX, e.clientY, 1, 1).data;

    var hex = rgbToHex(pixelData[0], pixelData[1], pixelData[2]);

    swal({
      title: "Temperature",
      text: ""+get_closest(hex),
      type: "info",
      confirmButtonColor: "#009494",
    });

}


var height=0;
var weight=0;
function calculate_bmi(weight, height)
{
    var bmi=weight/(height*height);
    return bmi;
}
function display_bmi(){
    var height=document.getElementById("height").value;
    var weight=document.getElementById("weight").value;
    var finalbmi=calculate_bmi(weight,height);
    document.getElementById("res").innerHTML="Your BMI is "+finalbmi;
    if(finalbmi<18.5){
        document.getElementById("res").innerHTML+="<br/> You're under weight!";
    }
    else if(finalbmi>18.5 && finalbmi<24.9){
        document.getElementById("res").innerHTML+="<br/> Your weight is normal.";
    }
    else if(finalbmi>25.0 && finalbmi<29.9){
        document.getElementById("res").innerHTML+="<br/> You're over weight!";
    }
    else if (finalbmi>=30){
        document.getElementById("res").innerHTML+="<br/> You're obese...   ";
    }
    else if (finalbmi===18.5){
        document.getElementById("res").innerHTML+="your weight is normal.";
    }
    else if (finalbmi===25.0){
        document.getElementById("res").innerhtml+="you are over weight";
    }
}
const cityName = document.getElementById('cityName');
const submit_btn = document.getElementById('submit_btn');
const city_name = document.getElementById('city_name')
const temp_status = document.getElementById('temp_status');
const temp_vall = document.getElementById('temp_vall')

submit_btn.addEventListener('click', async(event)=>{
    event.preventDefault();
    let cityVal = cityName.value;
    if(cityVal===""){
        city_name.innerText = `Plz write city name before search`;
    }else{
        try{
        let url = `http://api.openweathermap.org/data/2.5/weather?q=${cityVal}&units=metric&appid=a6a2721faca3e14627d8350fd2c5bf54`;
        const response = await fetch(url);
        const data = await response.json();
        const arrData = [data];
        temp_status.innerText = arrData[0].weather[0].main;
        temp_vall.innerText = arrData[0].main.temp
        city_name.innerText = `${arrData[0].name} | ${arrData[0].sys.country}`
   
        // console.log(arrData)

        }catch(err){
            city_name.innerText = `Plz write city name properly`;
        }
    }

})


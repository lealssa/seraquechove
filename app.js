document.addEventListener('alpine:init', () => {
    Alpine.data('weather', () => ({
        apiKey: '193d7314a591b4b2356ecd5fe44d3506',
        city: '',
        errorInfo: {},
        isErrored: false,
        isWeatherLoaded: false,
        weatherImages: {
            Clear: 'images/clear.png',
            Clouds: 'images/cloud.png',
            Mist: 'images/mist.png',
            Rain: 'images/rain.png',
            Snow: 'images/snow.png'
        },
        weatherConditions: {
            image: '',
            temperature: 0,
            description: '',
            humidity: 0,
            wind: 0
        },
        fetchWeather() {

            if (this.city === '')
                return

            this.isErrored = false
            this.isWeatherLoaded = false
            this.errorInfo = {}

            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.city}&units=metric&appid=${this.apiKey}&lang=pt_br`)
                .then(response => response.json())
                .then(json => {

                    if (json.cod === "404") {
                        this.isErrored = true
                        this.isWeatherLoaded = false
                        this.errorInfo.img = 'images/404.png'
                        this.errorInfo.msg = 'Oops... localização não encontrada'
                        return
                    }
                    else if (json.cod === 401)
                        throw new Error("Não autorizado! Verifique a APIKEY")

                    this.weatherConditions.image = this.weatherImages[json.weather[0].main]
                    this.weatherConditions.temperature = parseInt(json.main.temp)
                    this.weatherConditions.description = json.weather[0].description
                    this.weatherConditions.humidity = json.main.humidity
                    this.weatherConditions.wind = parseInt(json.wind.speed)

                    this.isWeatherLoaded = true
                    
                })
                .catch((err) => {
                    this.isErrored = true
                    this.isWeatherLoaded = false
                    this.errorInfo.img = 'images/error.png'
                    this.errorInfo.msg = 'Oops... ocorreu um erro'

                    console.error(err)
                    return
                })
        }
    }))
})
import { useState, useEffect, useRef } from "react";
import "./App.css";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import Card from "./Card";
import { Chart } from 'react-google-charts';

function App() {
  const [states, setStates] = useState({
    historyChartVisible: false,
    forecastChartVisible: false
  });

  const [styles, setStyles] = useState({
    temp: {
      boxShadow: "0 0 15px white",
      height: "150px",
      width: "150px"
    },
    hum: {
      boxShadow: "0 0 15px white",
      height: "150px",
      width: "150px"
    },
    sTerm: {
      boxShadow: "0 0 15px white",
      height: "150px",
      width: "150px"
    },
    visibility: {
      boxShadow: '0 0 15px green',
      height: "150px",
      width: "150px"
    },
    moreDataStyle: {
      display: 'flex'
    }
  });
  const [moreData, setMoreData] = useState({});
  const [temp, setTemp] = useState();
  const [hum, setHum] = useState();
  const [sTerm, setSterm] = useState();
  const bbs = "0 0 20px";

  const apiKey = '24963e48d5cd4b7d6506174a79b44a8a';
  const lat = 10.391;
  const lon = -75.4794;
  const dataUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  useEffect(() => {
    axios
      .get(dataUrl)
      .then((response) => {
        const data = response.data;
        const temp = response.data.main.temp;
        const hum = response.data.main.humidity;
        const sTerm = response.data.main.feels_like;

        setTemp(`${temp.toString().slice(0, 2)}º`);
        setHum(`${hum}%`);
        setSterm(`${sTerm.toString().slice(0, 2)}º`);

        let updStyles;

        if (temp < 20) {
          updStyles = {
            ...styles,
            temp: { ...styles.temp, boxShadow: `${bbs} lightblue` },
          };
        } else if (temp > 29) {
          updStyles = {
            ...styles,
            temp: { ...styles.temp, boxShadow: `${bbs} red` },
          };
        } else {
          updStyles = {
            ...styles,
            temp: { ...styles.temp, boxShadow: `${bbs} lightgreen` },
          };
        }

        if (hum < 30) {
          updStyles = {
            ...updStyles,
            hum: { ...updStyles.hum, boxShadow: `${bbs} red` },
          };
        } else if (hum > 60) {
          updStyles = {
            ...updStyles,
            hum: { ...updStyles.hum, boxShadow: `${bbs} red` },
          };
        } else {
          updStyles = {
            ...updStyles,
            hum: { ...updStyles.hum, boxShadow: `${bbs} green` },
          };
        }

        if (sTerm < 20) {
          updStyles = {
            ...updStyles,
            sTerm: { ...updStyles.sTerm, boxShadow: `${bbs} lightblue` },
          };
        } else if (sTerm > 29) {
          updStyles = {
            ...updStyles,
            sTerm: { ...updStyles.sTerm, boxShadow: `${bbs} red` },
          };
        } else {
          updStyles = {
            ...updStyles,
            sTerm: { ...updStyles.sTerm, boxShadow: `${bbs} green` },
          };
        }

        setStyles(updStyles);

        const moreData = {
          temp_min: `${data.main.temp_min.toString().slice(0, 2)}º`,
          temp_max: `${data.main.temp_max.toString().slice(0, 2)}º`,
          pressure: data.main.pressure,
          visibility: data.visibility,
          wind_speed: data.wind.speed,
          city: data.name,
          l: "(24 horas)",
        };
        setMoreData(moreData);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
      });
  }, []);
  
  const [forecastData, setForecastData] = useState([]);

  const getMonthName = (month) => {
    switch (month) {
      case 1:
        return "Ene";
      case 2:
        return "Feb";
      case 3:
        return "Mar";
      case 4:
        return "Abr";
      case 5:
        return "May";
      case 6:
        return "Jun";
      case 7:
        return "Jul";
      case 8:
        return "Ago";
      case 9:
        return "Sep";
      case 10:
        return "Oct";
      case 11:
        return "Nov";
      case 12:
        return "Dic";
      default:
        return "Mes no válido";
    }
  };  
  

  useEffect(() => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=24963e48d5cd4b7d6506174a79b44a8a`;
  
    axios.get(apiUrl)
      .then((response) => {
        const dataChart = [['Día', 'Valor', { role: 'annotation' }]];
        const data = response.data.list;
        const updatedForecastData = [];
        for (let i = 3; i < 40; i += 8) {
          const temperature = (data[i].main.temp - 273.15).toFixed(0);
          updatedForecastData.push(temperature);
  
          const dateData = data[i].dt_txt.split(" ");
          const date = new Date(dateData[0]);
          const day = date.getDate();
          const month = getMonthName(date.getMonth() + 1);

          if (i === 3) {
            dataChart.push(["Hoy", parseInt(temperature), parseInt(temperature).toString() + 'º']);
          } else if (i === 11) {
            dataChart.push(["Mañana", parseInt(temperature), parseInt(temperature).toString() + 'º']);
          } else {
            dataChart.push([`${day} de ${month}`, parseInt(temperature), parseInt(temperature).toString() + 'º']);
          }
        }

        setForecastData(dataChart);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  
  
  const [chartData, setChartData] = useState({});
  
  useEffect(() => {
    const data = [['Mes', 'Valor', { role: 'annotation' }]]; 

    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril',
      'Mayo', 'Junio', 'Julio', 'Agosto',
      'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    for (let i = 0; i < 12; i++) {
      const randomValue = Math.floor(Math.random() * 45);
      data.push([months[i], randomValue, randomValue.toString() + 'º']);
    }

    setChartData(data);
  }, []);

  const [windowH, setWinH] = useState(window.innerHeight);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 0) {
        setStyles(prevStyles => ({
          ...prevStyles,
          navBarStyle: { ...prevStyles.navBarStyle, animation: 'scaleDown .3s ease forwards' }
        }));
      } else {
        setStyles(prevStyles => ({
          ...prevStyles,
          navBarStyle: { ...prevStyles.navBarStyle, animation: 'scaleUp .3s ease forwards' }
        }));
      }
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [windowH]);

  const [isMDOpen, setIsMDOpen] = useState(true);
  const openMDList = () => {
    setIsMDOpen(!isMDOpen);  
    if (isMDOpen) {
      setTimeout(() => {
        setStyles({ ...styles, moreDataStyle: {...styles.moreDataStyle, display: 'none' } });
      }, 300);
    } else {
      setStyles({ ...styles, moreDataStyle: {...styles.moreDataStyle, display: 'flex' } });
    }
  };

  const openChartList = () => {
    setStates((prevStates) => ({
      ...prevStates,
      historyChartVisible: !prevStates.historyChartVisible
    })); 
  };

  const openForecastChart = () => {
    setStates((prevStates) => ({
      ...prevStates,
      forecastChartVisible: !prevStates.forecastChartVisible
    })); 
  };
   
  return (
    <>
      <Header style={styles.navBarStyle} />
      <main className="container">
        <div className="topData">
          <Card temp={temp} style={styles.temp} title="Temperatura" />
          <Card temp={hum} style={styles.hum} title="Humedad" />
          <Card temp={sTerm} style={styles.sTerm} title="Sens. Térmica" />
          <Card temp={`${moreData.visibility} km/h`} style={styles.visibility} title="Visibilidad" />
        </div>
        <div className="moreDataContainer">
          <div>
            <button type="button" onClick={openMDList} className="titleButton">Más datos {moreData.l}</button>
            <div className={`moreData ${isMDOpen ? "openMD" : "closedMD"}`} style={styles.moreDataStyle}>
                <span>Ciudad: {moreData.city}</span>
                <span>Temperatura mínima: {moreData.temp_min}</span>
                <span>Temperatura máxima: {moreData.temp_max}</span>
                <span>Velocidad del viento: {moreData.wind_speed} km/h</span>
                <span>Presión atmosférica: {moreData.pressure} hPa</span>
            </div>
          </div>
          <div>
            <button type="button" onClick={openChartList} className="titleButton">Historial de temperatura</button>
            {states.historyChartVisible &&
            <Chart
                width={'100%'}
                height={'60vh'}
                chartType='BarChart'
                loader={<div>Cargando Gráfico...</div>}
                data={chartData}
                className="historyChart" 
                options={{
                  backgroundColor: "none",
                  legend: { position: 'none'},
                  colors: ['rgb(13, 132, 187)'],
                  bar: { groupWidth: '40%'},
                  animation: {
                    startup: true,
                    duration: 1000,
                    easing: 'out'
                  },
                  chartArea: {
                    backgroundColor: 'none',
                    top: 20,
                    bottom: 20,
                    left: '20%'
                  },
                  gridlines: {
                    color: 'transparent'
                  },
                  hAxis: {
                    viewWindow: {
                      max: 45
                    }
                  },
                  annotations: {
                    textStyle: {
                      fontSize: 12,
                      color: 'black'
                    },
                    stem: {
                      color: 'none',
                      length: 5
                    },
                    position: 'center'
                  }
                }}
              />}
            </div>
            <div>
              <button type="button" className="titleButton" onClick={openForecastChart}>Pronóstico</button>
              {states.forecastChartVisible &&
                <Chart
                  width={'100%'}
                  height={'60vh'}
                  chartType='BarChart'
                  loader={<div>Cargando Gráfico...</div>}
                  data={forecastData}
                  className="forecastData" 
                  options={{
                    backgroundColor: "none",
                    responsive: true,
                    maintainAspectRatio: false,
                    colors: ['rgb(13, 132, 187)'],
                    bar: { groupWidth: '40%'},
                    animation: {
                      startup: true,
                      duration: 1000,
                      easing: 'out'
                    },
                    chartArea: {
                      backgroundColor: 'none',
                      top: 20,
                      bottom: 20,
                      left: '20%'
                    },
                    gridlines: {
                      color: 'transparent'
                    },
                    hAxis: {
                      viewWindow: {
                        min: 0,
                        max: 40
                      }
                    },
                    annotations: {
                      textStyle: {
                        fontSize: 17,
                        color: 'black'
                      },
                      stem: {
                        color: 'none',
                        length: 5
                      },
                      position: 'center'
                    }
                  }}
                />}
            </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default App;

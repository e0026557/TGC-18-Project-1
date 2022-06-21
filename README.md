# **Museums@SG**

![Screenshots of Museums@SG's homepage](assets/screenshots/responsive-screenshots.png)

Link to demo : [Museums@SG](https://sg-museums.netlify.app/)

Recent growing interest in the arts and culture of Singapore among young Singaporeans has seen events such as the Singapore Arts Week (SAW) and unique exhibitions like the *"Marvel Studios : 10 Years of Heroes"* sprung up over the years. 

Museums@SG aims to ride on this trend to promote awareness of Singapore's arts and culture among Singaporeans, especially the younger generations. While the Singapore Art Museum and the Singapore Art Science Museum are few of the well-known and most frequented museums, little is known about the other 50+ museums dotted around Singapore.

 In a quick glance, Museums@SG provides essential information about all the museums in Singapore, with features such as weather forecast, nearby dining and transport, as well as navigation for those art-lovers and 'museum-hoppers' out there.


---

## UI/UX

Link to user persona study can be found [here](https://miro.com/app/board/uXjVOvARG74=/?share_link_id=463975420245).

### User Goals

The users of Museums@SG are mostly students and young adults who have an interest for the arts. The aim of users is to be able to access information about all the museums in Singapore with ease. Additionally, users would also want to get informed advisory on the directions, nearby amenities and weather conditions around the museum locations. 


### Organisational Goals

Organisations such as the National Arts Council (NAC) aim to promote awareness for the arts and culture in Singapore and would want a platform that can provide information about all the museums in Singapore and encourage participation in arts events. 


### Structure and Skeleton

[Sitemap](https://miro.com/app/board/uXjVOvH0src=/?share_link_id=918144273258)

[Wireframes](assets/wireframes/wireframes.pdf)

---

## Features

---

## Technologies Used

1. HTML

2. CSS

3. [Bootstrap 5](https://getbootstrap.com/docs/5.0/getting-started/introduction/) 
    - Used for buttons, tabs and offcanvas of website

4. JavaScript

5. [Axios](https://github.com/axios/axios)
    - Used to fetch data from APIs used by website

6. [LeafletJS](https://leafletjs.com/)
    - Used to render interactive map used by website

7. [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster)
    - Used to cluster map markers on map

8. [Leaflet.encoded](https://github.com/jieter/Leaflet.encoded)
    - Used to render polyline route between locations on map

---

## Testing

---

## Deployment

The website is hosted using [Netlify](https://www.netlify.com/), deployed directly from the main branch of this Github repository.

---

## Credits and Acknowledgement

### Logo :
1. [Adobe Express Logo Maker](https://www.adobe.com/express/create/logo) - Used to generate brand logo for website

### Fonts :
1. [Google Fonts](https://fonts.google.com/) - Used for fonts displayed in website 

### Icons :
1. [Font Awesome](https://fontawesome.com/) - Used in tabs and buttons of website

2. [Flaticon](https://www.flaticon.com/) - Used in map marker icons of website


### Data :
1. [Data.gov.sg](https://data.gov.sg/) 
    - The 'Museums' dataset by National Heritage Board was used to display museum information and photos on website

2. [OpenWeather API](https://openweathermap.org/) 
    - Used to display current weather, weather forecast and icons on website

3. [Tourism Information & Services Hub (TIH) Experiential Route API](https://tih-dev.stb.gov.sg/map-api/apis/get/v1.1/experiential_route/%7Bmode%7D) 
    - Used to display navigation route between locations on map
# **Museums@SG**

![Screenshots of Museums@SG's homepage](assets/screenshots/responsive-screenshots.png)

Link to demo : [Museums@SG](https://sg-museums.netlify.app/)

## Summary
Museums@SG is a web application with an interactive map feature that allows users to explore the various museums dotted around Singapore.

In line with efforts by the National Arts Council (NAC) to promote art consumption and museums, Museums@SG aims to promote awareness of Singapore's arts and cultures among Singaporeans, especially the younger generations.

 In a quick glance, Museums@SG provides essential information about all the museums in Singapore, with features such as weather forecast, nearby dining and transport, as well as navigation for those art-lovers and 'museum-hoppers' out there. These features save users time and effort needed to search each museum and related information one by one on the Internet.


---

## UI/UX

Link to user persona study can be found [here](assets/user-personas/user-persona-study.pdf).

### User Goals

The users of Museums@SG are mostly students and young adults with an interest for the arts. The aim of users is to be able to access information about all the museums in Singapore with ease. Additionally, users would also want to get informed advisory on the directions, nearby amenities and weather conditions around the museum locations. 


### Organisational Goals

Organisations such as the National Arts Council (NAC) aim to promote awareness for the arts and culture in Singapore and would want a platform that can provide information about all the museums in Singapore and encourage participation in arts and museum events. 


### Structure and Skeleton

[Sitemap](https://miro.com/app/board/uXjVOvH0src=/?share_link_id=918144273258)

[Wireframes](assets/wireframes/wireframes.pdf)

---

## Features

| Features | Description |
| ----------- | ----------- |
| Search museum by name | This search feature allows users to search for a museum by its name. |
| Autocomplete suggestion | This feature is designed to work with the search feature to provide a dropdown list of suggested museum names based on the user's current input in the search field and the list will update dynamically as the user types in his/her search query. |
| Display museum information based on marker interaction | This feature allows user to interact with the map to explore the various museums dotted around Singapore. Clicking on any of the museum markers will trigger the expansion of the map console to display more information about the museum, as well as other features around the museum. |
| Display weather information | This feature allows users to check the current weather and a 2-hour weather forecast at the museum's location to enable better planning of itineraries. |
| Display nearby amenities around museum | This feature allows users to search for any amenities (Eg. Dining, parking and bus stops etc.) near the museum for better planning of itineraries. |
| Navigation | This feature displays the polyline route between user-specified start and end locations on the map to help users get from one location to another |
| Display user's current location | This feature allows users to locate themselves on the map and set their locations as start or end points for route navigation. |
| Help form | This feature allows users to submit suggestions or requests for assistance. The form is designed with validation rules to prevent invalid inputs from being submitted. (Note: Due to the scope of the project, the form submission does not have a backend to handle the post request) |


---

## Limitations and Future Implementations

- Design a more comprehensive search feature
    - Current limitation : 
        - The current search feature can only handle queries that match the museum names (case-insensitive) 
    - Future implementation : 
        - To provide a suggestion even if user's query has some typos and to allow for search based on tags or related keywords in addition to museum names

- Incorporate museum websites and ticketing sites into website
    - Current limitation :
        - The website can only provide the address and description of the museums based on the museums dataset from Data.gov.sg
    - Future implementation :
        - To provide more information about the museums, future implementations can include providing links to the museum webpages as well as information relating to ticketing and operating hours.

- Improve on the museum photos displayed on website
    - Current limitation :
        - The museum photos are currently extracted from the museum dataset from Data.gov.sg and hence, there are some differences in image quality
    - Future implementation :
        - To collate a set of photos for each museum and integrate these photos with the museum dataset from Data.gov.sg so that the photos displayed will be coherent

- Provide turn-by-turn navigation instructions in addition to the current polyline route
    - Current limitation :
        - Due to time constraints, the current navigation feature is only able to display the polyline route between two specified locations on the map
    - Future implementation :
        - To add turn-by-turn navigation instructions to guide users from the specified starting point to destination

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
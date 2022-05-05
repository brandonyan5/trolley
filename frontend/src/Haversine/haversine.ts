import './index.css';

type location = {
    address: any
    boundingbox: string[]
    class: string
    display_name: string
    importance: number
    lat: string
    licence: string
    lon: string
    osm_id: number
    osm_type: string
    place_id: number
    type: string
}

// Takes two addresses of the format "69 Brown St" and then outputs the haversine distance between them. Assumes they are both in Providence.

function addressestoDistance(address1: string, address2: string) {
    const ad1split: string[] = address1.split(" ")
    const ad2split: string[] = address2.split(" ")
    const firstIntermediate = ad1split[0] + "+" + ad1split[1] + "+" + ad1split[2] + ",+" + "providence"
    const secondIntermediate = ad2split[0] + "+" + ad2split[1] + "+" + ad2split[2] + ",+" + "providence"
    const beginning = "https://nominatim.openstreetmap.org/search?q="
    const ending = ";df&format=json&polygon=1&addressdetails=1"

    const firstURL = beginning + firstIntermediate + ending
    const secondURL = beginning + secondIntermediate + ending

    let lat1: number
    let lon1: number

    let lat2: number
    let lon2: number

    console.log(firstURL)

    fetch(firstURL, {}).then(response => response.json())
        .then((data: location[]) => {
            console.log(data[0].lat)
            console.log(data[0].lon)

            lat1 = parseFloat(data[0].lat)
            lon1 = parseFloat(data[0].lon)

            fetch(secondURL, {}).then(response => response.json())
                .then((data: location[]) => {
                    console.log(data[0].lat)
                    console.log(data[0].lon)

                    lat2 = parseFloat(data[0].lat)
                    lon2 = parseFloat(data[0].lon)

                    console.log(lat1.toString() + "LAT 1")
                    console.log(lon1.toString() + "LON 1")
                    console.log(lat2.toString() + "LAT 2")
                    console.log(lon2.toString() + "LON 2")
                    const d = haversine_distance(lat1, lat2, lon1, lon2)
                    console.log("DISTANCE " + d.toString())

                    return d
                })
        })
}

// From https://cloud.google.com/blog/products/maps-platform/how-calculate-distances-map-maps-javascript-api

function haversine_distance(lat1: number, lat2: number, lon1: number, lon2: number) {
    var R = 3958.8; // Radius of the Earth in miles
    var rlat1 = lat1 * (Math.PI/180); // Convert degrees to radians
    var rlat2 = lat2 * (Math.PI/180); // Convert degrees to radians
    var difflat = rlat2-rlat1; // Radian difference (latitudes)
    var difflon = (lon2-lon1) * (Math.PI/180); // Radian difference (longitudes)

    var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
    return d;
}

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

export async function addressestoDistance(address1: string, address2: string): Promise<string> {
    const ad1split: string[] = address1.split(" ")
    const ad2split: string[] = address2.split(" ")
    const firstIntermediate = ad1split[0] + "+" + ad1split[1] + "+" + ad1split[2] + ",+" + "providence"
    const secondIntermediate = ad2split[0] + "+" + ad2split[1] + "+" + ad2split[2] + ",+" + "providence"
    const beginning = "https://nominatim.openstreetmap.org/search?q="
    const ending = ";df&format=json&polygon=1&addressdetails=1"

    const firstURL = beginning + firstIntermediate + ending
    const secondURL = beginning + secondIntermediate + ending


    const latLong1 = await fetch(firstURL, {}).then(response => response.json())
    const latLong2 = await fetch(secondURL, {}).then(response => response.json())
    if (latLong1.length == 0 || latLong2.length == 0) {
        console.log("ERROR: Invalid address encountered")
        return "ERROR"
    }
    const lat1 = latLong1[0].lat
    const lat2 = latLong2[0].lat
    const long1 = latLong1[0].lon
    const long2 = latLong2[0].lon
    console.log("DISTANCE: " + haversine_distance(lat1, lat2, long1, long2))
    return haversine_distance(lat1, lat2, long1, long2).toString()
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
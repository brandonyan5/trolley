package edu.brown.cs.student.main;

import com.google.common.collect.ImmutableMap;
import com.google.gson.Gson;
//import edu.brown.cs.student.main.email.EmailOwner;
//import edu.brown.cs.student.main.email.EmailOwner;
//import edu.brown.cs.student.main.email.EmailOwner;
import edu.brown.cs.student.main.email.EmailOwner;
import edu.brown.cs.student.main.email.EmailUser;
import edu.brown.cs.student.main.filter.Filter;
import edu.brown.cs.student.main.listing.Listing;
import edu.brown.cs.student.main.sorter.Sorter;
import joptsimple.OptionParser;
import joptsimple.OptionSet;
import netscape.javascript.JSObject;
import org.checkerframework.checker.units.qual.A;
import org.json.JSONArray;
import org.json.JSONObject;
import spark.Request;
import spark.Response;
import spark.Route;
import spark.Spark;
import java.sql.SQLException;
import java.util.*;

// This is a method for calculating the distance between two locations

//function haversine_distance(mk1, mk2) {
//        var R = 3958.8; // Radius of the Earth in miles
//        var rlat1 = mk1.position.lat() * (Math.PI/180); // Convert degrees to radians
//        var rlat2 = mk2.position.lat() * (Math.PI/180); // Convert degrees to radians
//        var difflat = rlat2-rlat1; // Radian difference (latitudes)
//        var difflon = (mk2.position.lng()-mk1.position.lng()) * (Math.PI/180); // Radian difference (longitudes)
//
//        var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
//        return d;
//        }


// This is how you actually get the coordinates from the addresses
// https://stackoverflow.com/questions/3490622/get-latitude-and-longitude-based-on-location-name-with-google-autocomplete-api

/**
 * The Main class of our project. This is where execution begins.
 *
 */

public final class Main {

  private static final int DEFAULT_PORT = 4567;

  /**
   * The initial method called when execution begins.
   *
   * @param args An array of command line arguments
   */
  public static void main(String[] args) {
    new Main(args).run();
  }

  private String[] args;

  private Main(String[] args) {
    this.args = args;
  }

  private void run() {
	  
    OptionParser parser = new OptionParser();
    parser.accepts("gui");
    parser.accepts("port").withRequiredArg().ofType(Integer.class).defaultsTo(DEFAULT_PORT);

    OptionSet options = parser.parse(args);
    
	if (options.has("gui")) {
		runSparkServer((int) options.valueOf("port"));
	}    
  }
  
  private static void runSparkServer(int port) {
      Spark.port(port);
      Spark.externalStaticFileLocation("src/main/resources/static");
      
      Spark.options("/*", (request, response) -> {
          String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
          if (accessControlRequestHeaders != null) {
            response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
          }

          String accessControlRequestMethod = request.headers("Access-Control-Request-Method");

          if (accessControlRequestMethod != null) {
            response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
          }

          return "OK";
        });

        Spark.before((request, response) -> response.header("Access-Control-Allow-Origin", "*"));
        
        // Put Routes Here
        Spark.post("/filterAndSortProducts", new FilterAndSortProducts());
        Spark.post("/emailOwnerOnClaim", new EmailOwnerOnClaim());
        Spark.post("/emailUserOnDecision", new EmailUserOnDecision());
        Spark.init();
    }


    //how to convert list of listings back into a JSON
    //how to get lat long from address
    //todo
    //get return json in the right order
    //email
    //google maps api
    //email all works, except it doesn't check for an invalid email address. should check in firebase frontend part
    //do date filtering
    private static class FilterAndSortProducts implements Route {
        @Override
        public String handle(Request request, Response response) throws Exception {
            JSONObject reqJSON = new JSONObject(request.body());

            System.out.println(reqJSON.toString());

            JSONObject productJSON = reqJSON.getJSONObject("dataToSend").getJSONObject("products");
            Iterator<String> productIterator = productJSON.keys();

            JSONObject filterJSON = reqJSON.getJSONObject("dataToSend").getJSONObject("filters");
            String userAddress = "";

            // get filter weights
            JSONArray filterWeightJSON =  reqJSON.getJSONObject("dataToSend").getJSONArray("filterWeights");
            // convert to array of doubles
            double[] filterWeights = new double[3];
            for (int i = 0; i < 3; i++) {
                filterWeights[i] = Double.parseDouble(filterWeightJSON.getString(i));
            }

            List<String> dates = new ArrayList<>();
            List<String> areaRange = new ArrayList<>();
            List<String> priceRange = new ArrayList<>();

            JSONObject datesObject = filterJSON.getJSONObject("dates");
            JSONObject areaObject = filterJSON.getJSONObject("area");
            JSONObject priceObject = filterJSON.getJSONObject("price");

            Iterator<String> datesIterator = datesObject.keys();
            Iterator<String> areaIterator = areaObject.keys();
            Iterator<String> priceIterator = priceObject.keys();

            while (datesIterator.hasNext()) {
                String dateKey = datesIterator.next();
                dates.add(dateKey);
                dates.add(datesObject.getString(dateKey));
            }
            while (areaIterator.hasNext()) {
                String areaKey = areaIterator.next();
                areaRange.add(areaKey);
//                System.out.println("STRING/NUMBER: " + areaObject.getString(areaKey));
                areaRange.add(areaObject.getString(areaKey));
            }
            while (priceIterator.hasNext()) {
                String priceKey = priceIterator.next();
                priceRange.add(priceKey);
                priceRange.add(priceObject.getString(priceKey));
            }

            String distance = filterJSON.getString("distance");
            Filter.dates = dates;
            Filter.distance = Double.parseDouble(distance);

            List<Double> newAreas = new ArrayList<>();
            for (String eachArea : areaRange) {
                newAreas.add(Double.parseDouble(eachArea));
            }

            List<Double> newPrices = new ArrayList<>();
            for (String eachPrice : priceRange) {
                newPrices.add(Double.parseDouble(eachPrice));
            }
            Filter.areas = newAreas;
            Filter.prices = newPrices;

            List<Listing> tempListings = new ArrayList<>();
            while (productIterator.hasNext()) {
                String eachKey = productIterator.next();
                JSONObject eachProductJSON = productJSON.getJSONObject(eachKey);
                String address = eachProductJSON.getString("address");
                String distanceListing = eachProductJSON.getString("distance");
                String price = eachProductJSON.getString("price");
                String area = eachProductJSON.getString("area");
                String dateStart = eachProductJSON.getString("date_start");
                String dateEnd = eachProductJSON.getString("date_end");
                String ownerID = eachProductJSON.getString("owner_id");
                String userID = eachProductJSON.getString("user_id");

                Listing newListing = new Listing(address, Double.parseDouble(distanceListing), Double.parseDouble(price), Double.parseDouble(area),
                        dateStart, dateEnd, ownerID, userID, eachKey);

                tempListings.add(newListing);
            }

            List<Listing> filteredListings = Filter.isValid(tempListings);
            System.out.println("filteredListings: " + filteredListings.size());
            Sorter theSorter = new Sorter();

            List<Listing> sortedListings = theSorter.sortAll(filteredListings, filterWeights);

//            for (Listing thing: sortedListings) {
//                System.out.println(thing.getListingName());
//                System.out.println("NORMALIZED PRICE: " + thing.getNormalizedNumeric().get(0));
//                System.out.println("NORMALIZED AREA: " + thing.getNormalizedNumeric().get(1));
//                System.out.println("NORMALIZED DISTANCE: " + thing.getNormalizedNumeric().get(2));
//                System.out.println("DISTANCE: " + thing.getDistance());
//                System.out.println("EUCLIDEAN DIST: " + thing.geteuclideanDistance());
//            }

            LinkedHashMap<String, LinkedHashMap<String, String>> returnListings = new LinkedHashMap<>();
            for (Listing eachListing : sortedListings) {
                String address = eachListing.getAddress();
                Double distanceListing = eachListing.getDistance();
                Double price = eachListing.getPrice();
                Double area = eachListing.getArea();
                String dateStart = eachListing.getDate_start();
                String dateEnd = eachListing.getDate_end();
                String ownerID = eachListing.getOwnerID();
                String userID = eachListing.getUserID();
                String listingName = eachListing.getListingName();

                LinkedHashMap<String, String> innerMap = new LinkedHashMap<>();
                innerMap.put("address", address);
                innerMap.put("distance", String.valueOf(distanceListing));
                innerMap.put("price", String.valueOf(price));
                innerMap.put("area", String.valueOf(area));
                innerMap.put("date_start", dateStart);
                innerMap.put("date_end", dateEnd);
                innerMap.put("owner_id", ownerID);
                innerMap.put("user_id", userID);

                returnListings.put(listingName, innerMap);
                System.out.println("====");
                System.out.println(listingName);
                System.out.println(address);
            }
            Gson GSON = new Gson();
            System.out.println("RETURNING " + returnListings.size() + " sorted listings");
            return GSON.toJson(returnListings);

        }
    }


    private static class EmailOwnerOnClaim implements Route {
        @Override
        public String handle(Request request, Response response) throws Exception {
            JSONObject reqJSON = new JSONObject(request.body());
            String ownerEmail = reqJSON.getString("owner_email");
            String otherEmail = reqJSON.getString("user_email");

            if (EmailOwner.sendEmailToOwner(ownerEmail)) {
                return "200 OK";
            } else {
                return "ERROR!";
            }
        }
    }

    private static class EmailUserOnDecision implements Route {
        @Override
        public String handle(Request request, Response response) throws Exception {
            JSONObject reqJSON = new JSONObject(request.body());
            String userEmail = reqJSON.getString("user_email");
            String otherEmail = reqJSON.getString("owner_email");

            if (reqJSON.getString("accepted").equals("true")) {
                if (EmailUser.sendEmailToUserAccepted(userEmail)) {
                    return "200 OK";
                } else {
                    return "ERROR!";
                }
            } else {
                if (EmailUser.sendEmailToUserRejected(userEmail)) {
                    return "200 OK";
                } else {
                    return "ERROR!";
                }
            }

        }
    }
  
}
































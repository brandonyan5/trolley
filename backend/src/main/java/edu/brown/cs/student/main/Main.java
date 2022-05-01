package edu.brown.cs.student.main;

import com.google.common.collect.ImmutableMap;
import com.google.gson.Gson;
//import edu.brown.cs.student.main.email.EmailOwner;
//import edu.brown.cs.student.main.email.EmailOwner;
//import edu.brown.cs.student.main.email.EmailOwner;
import edu.brown.cs.student.main.filter.Filter;
import edu.brown.cs.student.main.listing.Listing;
import edu.brown.cs.student.main.sorter.Sorter;
import joptsimple.OptionParser;
import joptsimple.OptionSet;
import netscape.javascript.JSObject;
import org.checkerframework.checker.units.qual.A;
import org.json.JSONObject;
import spark.Request;
import spark.Response;
import spark.Route;
import spark.Spark;
import java.sql.SQLException;
import java.util.*;

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
//        Spark.post("/emailOwnerOnClaim", new EmailOwnerOnClaim());
//        Spark.post("/emailUserOnDecision", new EmailUserOnDecision());
        Spark.init();
    }


    //how to convert list of listings back into a JSON
    //how to get lat long from address
    //todo
    //get return json in the right order
    //email
    //google maps api
    private static class FilterAndSortProducts implements Route {
        @Override
        public String handle(Request request, Response response) throws Exception {
            JSONObject reqJSON = new JSONObject(request.body());

            JSONObject productJSON = reqJSON.getJSONObject("Products");
            Iterator<String> productIterator = productJSON.keys();

            JSONObject filterJSON = reqJSON.getJSONObject("Filters");
            String userAddress = "";

            List<String> dates = new ArrayList<>();
            List<String> areaRange = new ArrayList<>();
            List<String> priceRange = new ArrayList<>();

            JSONObject datesObject = filterJSON.getJSONObject("Dates");
            JSONObject areaObject = filterJSON.getJSONObject("Area");
            JSONObject priceObject = filterJSON.getJSONObject("Price");

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
                areaRange.add(areaObject.getString(areaKey));
            }
            while (priceIterator.hasNext()) {
                String priceKey = priceIterator.next();
                priceRange.add(priceKey);
                priceRange.add(priceObject.getString(priceKey));
            }

            userAddress = filterJSON.getString("user_address");
            String distance = filterJSON.getString("Distance");
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
                String address = eachProductJSON.getString("Address");
                String price = eachProductJSON.getString("Price");
                String area = eachProductJSON.getString("Area");
                String dateStart = eachProductJSON.getString("Date_start");
                String dateEnd = eachProductJSON.getString("Date_end");
                String ownerEmail = eachProductJSON.getString("Owner_email");
                String userEmail = eachProductJSON.getString("User_email");

                Listing newListing = new Listing(address, Double.parseDouble(price), Double.parseDouble(area),
                        dateStart, dateEnd, ownerEmail, userEmail, eachKey);
                newListing.setDistanceGoogleMaps(userAddress);  //this method in Listing class updates the private distance var at the top of the Listing class

                tempListings.add(newListing);
            }
            List<Listing> filteredListings = Filter.isValid(tempListings);
            Sorter theSorter = new Sorter();

            List<Listing> sortedListings = theSorter.sortAll(filteredListings);

            for (Listing thing: sortedListings) {
                System.out.println(thing.getListingName());
                System.out.println("NORMALIZED PRICE: " + thing.getNormalizedNumeric().get(0));
                System.out.println("NORMALIZED AREA: " + thing.getNormalizedNumeric().get(1));
                System.out.println("NORMALIZED DISTANCE: " + thing.getNormalizedNumeric().get(2));
                System.out.println("EUCLIDEAN DIST: " + thing.geteuclideanDistance());
                System.out.println("DISTANCE: " + thing.getDistance());
            }

            LinkedHashMap<String, LinkedHashMap<String, String>> returnListings = new LinkedHashMap<>();
            for (Listing eachListing : sortedListings) {
                String address = eachListing.getAddress();
                Double price = eachListing.getPrice();
                Double area = eachListing.getArea();
                String dateStart = eachListing.getDate_start();
                String dateEnd = eachListing.getDate_end();
                String ownerEmail = eachListing.getOwnerEmail();
                String userEmail = eachListing.getUserEmail();
                String listingName = eachListing.getListingName();

                LinkedHashMap<String, String> innerMap = new LinkedHashMap<>();
                innerMap.put("Address", address);
                innerMap.put("Price", String.valueOf(price));
                innerMap.put("Area", String.valueOf(area));
                innerMap.put("Date_start", dateStart);
                innerMap.put("Date_end", dateEnd);
                innerMap.put("Owner_email", ownerEmail);
                innerMap.put("User_email", userEmail);

                returnListings.put(listingName, innerMap);
            }
            Gson GSON = new Gson();
            return GSON.toJson(returnListings);

        }
    }


//    private static class EmailOwnerOnClaim implements Route {
//        @Override
//        public String handle(Request request, Response response) throws Exception {
//            JSONObject reqJSON = new JSONObject(request.body());
//            String ownerEmail = "";
//
//            Iterator<String> iterator = reqJSON.keys();
//            while (iterator.hasNext()) {
//                String eachKey = iterator.next();
//                JSONObject theValue = reqJSON.getJSONObject(eachKey);
//                ownerEmail = theValue.getString("Owner_email");
//            }
//            if (EmailOwner.sendEmailToOwner(ownerEmail)) {
//                return "200 OK";
//            } else {
//                return "ERROR!";
//            }
//        }
//    }
//
//    private static class EmailUserOnDecision implements Route {
//        @Override
//        public String handle(Request request, Response response) throws Exception {
//            JSONObject reqJSON = new JSONObject(request.body());
//
//            String userEmail = "";
//            Iterator<String> iterator = reqJSON.keys();
//            while (iterator.hasNext()) {
//                String eachKey = iterator.next();
//                if (!eachKey.equals("Accepted")) {
//                    JSONObject theValue = reqJSON.getJSONObject(eachKey);
//                    userEmail = theValue.getString("User_email");
//                }
//            }
//
//            if (reqJSON.getString("Accepted").equals("true")) {
//                if (sendAcceptEmailToUser(userEmail)) {
//                    return "200 OK";
//                } else {
//                    return "ERROR!";
//                }
//            } else {
//                if (sendRejectEmailToUser(userEmail)) {
//                    return "200 OK";
//                } else {
//                    return "ERROR!";
//                }
//            }
//
//        }
//    }
  
}
































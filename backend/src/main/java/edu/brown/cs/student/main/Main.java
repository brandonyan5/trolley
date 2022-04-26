//package edu.brown.cs.student.main;
//
//import com.google.gson.Gson;
//import edu.brown.cs.student.main.listing.Listing;
//import edu.brown.cs.student.main.filter.Filter;
//import joptsimple.OptionParser;
//import joptsimple.OptionSet;
//import org.json.JSONObject;
//import spark.Request;
//import spark.Response;
//import spark.Route;
//import spark.Spark;
//
//import java.util.*;
//
///**
// * The Main class of our project. This is where execution begins.
// *
// */
//
//public final class Main {
//
//  private static final int DEFAULT_PORT = 4567;
//
//  /**
//   * The initial method called when execution begins.
//   *
//   * @param args An array of command line arguments
//   */
//  public static void main(String[] args) {
//    new Main(args).run();
//  }
//
//  private String[] args;
//
//  private Main(String[] args) {
//    this.args = args;
//  }
//
//  private void run() {
//
//    OptionParser parser = new OptionParser();
//    parser.accepts("gui");
//    parser.accepts("port").withRequiredArg().ofType(Integer.class).defaultsTo(DEFAULT_PORT);
//
//    OptionSet options = parser.parse(args);
//
//	if (options.has("gui")) {
//		runSparkServer((int) options.valueOf("port"));
//	}
//  }
//
//  private static void runSparkServer(int port) {
//      Spark.port(port);
//      Spark.externalStaticFileLocation("src/main/resources/static");
//
//      Spark.options("/*", (request, response) -> {
//          String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
//          if (accessControlRequestHeaders != null) {
//            response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
//          }
//
//          String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
//
//          if (accessControlRequestMethod != null) {
//            response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
//          }
//
//          return "OK";
//        });
//
//        Spark.before((request, response) -> response.header("Access-Control-Allow-Origin", "*"));
//
//        // Put Routes Here
//        Spark.post("/filterAndSortProducts", new FilterAndSortProducts());
//        Spark.post("/emailOwnerOnClaim", new EmailOwnerOnClaim());
//        Spark.post("/emailUserOnDecision", new EmailUserOnDecision());
//        Spark.init();
//    }
//
//
//    //how to convert list of listings back into a JSON
//    //how to get lat long from address
//    private static class FilterAndSortProducts implements Route {
//        @Override
//        public String handle(Request request, Response response) throws Exception {
//            JSONObject reqJSON = new JSONObject(request.body());
//
//            JSONObject productJSON = reqJSON.getJSONObject("Products");
//            Iterator<String> productIterator = productJSON.keys();
//
//            JSONObject filterJSON = reqJSON.getJSONObject("Filters");
//            Iterator<String> filterIterator = filterJSON.keys();
//            String userAddress = "";
//
//            while (filterIterator.hasNext()) {
//                String eachKey = filterIterator.next();
//                List<String> dates = (List<String>) filterJSON.getJSONArray("Dates");
//                List<String> areaRange = (List<String>) filterJSON.getJSONArray("Area");
//                List<String> priceRange = (List<String>) filterJSON.getJSONArray("Price");
//                userAddress = filterJSON.getString("user_address");
//                String distance = filterJSON.getString("Distance");
//                Filter.dates = dates;
//                Filter.distance = Double.parseDouble(distance);
//
//                List<Double> newAreas = new ArrayList<>();
//                for (String eachArea : areaRange) {
//                    newAreas.add(Double.parseDouble(eachArea));
//                }
//
//                List<Double> newPrices = new ArrayList<>();
//                for (String eachPrice : priceRange) {
//                    newPrices.add(Double.parseDouble(eachPrice));
//                }
//                Filter.areas = newAreas;
//                Filter.prices = newPrices;
//            }
//
//            List<Listing> tempListings = new ArrayList<>();
//            while (productIterator.hasNext()) {
//                String eachKey = productIterator.next();
//                JSONObject eachProductJSON = productJSON.getJSONObject(eachKey);
//                String address = eachProductJSON.getString("Address");
//                String price = eachProductJSON.getString("Price");
//                String area = eachProductJSON.getString("Area");
//                String dateStart = eachProductJSON.getString("Date_start");
//                String dateEnd = eachProductJSON.getString("Date_end");
//                String ownerEmail = eachProductJSON.getString("Owner_email");
//                String userEmail = eachProductJSON.getString("User_email");
//
//                Listing newListing = new Listing(address, Double.parseDouble(price), Double.parseDouble(area),
//                        dateStart, dateEnd, ownerEmail, userEmail, eachKey);
//                newListing.setDistance(userAddress);  //this method in Listing class updates the private distance var at the top of the Listing class
//                tempListings.add(newListing);
//                //then make ls object
//                //then call ls.setDistance(user_address)
//                //setDistance method is in listing class
//                //then add to a list
//                //then pass list into isValid - which returns a new list of listings with bad listings dropped
//                //then pass that into sort(), which returns the sorted list of listings
//                //then i convert that list of listings into a JSON, and return that at the end of this handler
//            }
//            List<Listing> filteredListings = Filter.isValid(tempListings);
//            List<Listing> sortedListings = Listing.sortListings(filteredListings);
//
//            Map<String, Map<String, String>> returnListings = new HashMap<>();
//            for (Listing eachListing : sortedListings) {
//                String address = eachListing.getAddress();
//                Double price = eachListing.getPrice();
//                Double area = eachListing.getArea();
//                String dateStart = eachListing.getDate_start();
//                String dateEnd = eachListing.getDate_end();
//                String ownerEmail = eachListing.getOwnerEmail();
//                String userEmail = eachListing.getUserEmail();
//                String listingName = eachListing.getListingName();
//
//                Map<String, String> innerMap = new HashMap<>();
//                innerMap.put("Address", address);
//                innerMap.put("Price", String.valueOf(price));
//                innerMap.put("Area", String.valueOf(area));
//                innerMap.put("Date_start", dateStart);
//                innerMap.put("Date_end", dateEnd);
//                innerMap.put("Owner_email", ownerEmail);
//                innerMap.put("User_email", userEmail);
//
//                returnListings.put(listingName, innerMap);
//                //convert back to JSON/GSON somehow - continue here
//            }
//            Gson GSON = new Gson();
//            return GSON.toJson(returnListings);
//
//        }
//    }
//
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
//            if (sendEmailToOwner(ownerEmail)) {
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
//
//}
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

package edu.brown.cs.student.main;

import com.google.gson.Gson;
import edu.brown.cs.student.main.email.EmailOwner;
import edu.brown.cs.student.main.email.EmailUser;
import edu.brown.cs.student.main.filter.Filter;
import edu.brown.cs.student.main.listing.Listing;
import edu.brown.cs.student.main.sorter.Sorter;
import joptsimple.OptionParser;
import joptsimple.OptionSet;
import org.json.JSONArray;
import org.json.JSONObject;
import spark.Request;
import spark.Response;
import spark.Route;
import spark.Spark;
import java.util.*;

/**
 * The Main class of our project. This is where execution begins.
 *
 */

public final class Main {

  /**
   * the port that the server is running on.
   */
  private static final int DEFAULT_PORT = 4567;

  /**
   * The initial method called when execution begins.
   *
   * @param args An array of command line arguments
   */
  public static void main(String[] args) {
    new Main(args).run();
  }

  /**
   * stores the command line args.
   */
  private String[] args;

  /**
   * main method.
   * @param args - the command line args
   */
  private Main(String[] args) {
    this.args = args;
  }

  /**
   * runs the server from the specified port.
   */
  private void run() {
    OptionParser parser = new OptionParser();
    parser.accepts("gui");
    parser.accepts("port").withRequiredArg().ofType(Integer.class).defaultsTo(DEFAULT_PORT);

    OptionSet options = parser.parse(args);

    if (options.has("gui")) {
      runSparkServer((int) options.valueOf("port"));
    }
  }

  /**
   * sets up the endpoints for our project.
   * @param port - the port number of the server
   */
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
    Spark.post("/emailOwnerOnUnclaim", new EmailOwnerOnUnclaim());
    Spark.post("/emailUserOnDecision", new EmailUserOnDecision());
    Spark.init();
  }

  /**
   * handler class that takes in listings and sends back sorted listings.
   */
  private static class FilterAndSortProducts implements Route {
    /**
     * takes in a JSON object, sorts the listings based on criteria, and sends back sorted JSON.
     * @param request - the JSON object with the listings
     * @param response - the sorted listings
     * @return - the sorted listings
     * @throws Exception - if there's an error when processing
     */
    @Override
    public String handle(Request request, Response response) throws Exception {
      JSONObject reqJSON = new JSONObject(request.body());
      //gets the JSON with the actual listing info
      JSONObject productJSON = reqJSON.getJSONObject("dataToSend").getJSONObject("products");
      Iterator<String> productIterator = productJSON.keys();
      JSONObject filterJSON = reqJSON.getJSONObject("dataToSend").getJSONObject("filters");

      // get filter weights
      JSONArray filterWeightJSON
              = reqJSON.getJSONObject("dataToSend").getJSONArray("filterWeights");
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

      //retrieves the proper information for the filter
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
      //for each iteration, creates a listing object with the retrieved fields
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
        Listing newListing = new Listing(address, Double.parseDouble(distanceListing),
                Double.parseDouble(price), Double.parseDouble(area),
                dateStart, dateEnd, ownerID, userID, eachKey);
        tempListings.add(newListing);
      }

      //filter and then sort the listings
      List<Listing> filteredListings = Filter.isValid(tempListings);
      Sorter theSorter = new Sorter();
      List<Listing> sortedListings = theSorter.sortAll(filteredListings, filterWeights);

      //converts the listings back into a JSON object to return to frontend
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
      }
      Gson gSON = new Gson();
      return gSON.toJson(returnListings);
    }
  }

  /**
   * class that sends email to the owner of the listing.
   */
  private static class EmailOwnerOnClaim implements Route {
    /**
     * takes in a JSON object, and sends an email to the appropriate address.
     * @param request - the JSON object with the listing info
     * @param response - the response
     * @return - whether or not the email was successfully sent
     * @throws Exception - if there's an error when processing
     */
    @Override
    public String handle(Request request, Response response) throws Exception {
      JSONObject reqJSON = new JSONObject(request.body());
      JSONObject dataToSend = reqJSON.getJSONObject("dataToSend");

      //retrieves the email addresses from the JSON
      String ownerEmail = dataToSend.getString("owner_email");
      String otherEmail = dataToSend.getString("user_email");

      //retrieves the address
      Iterator<String> iterator = dataToSend.keys();
      String address = "";
      while (iterator.hasNext()) {
        String listingName = iterator.next();
        address = dataToSend.getJSONObject(listingName).getString("address");
        break;
      }

      //sends the email
      if (EmailOwner.sendEmailToOwnerOnDecision(ownerEmail, otherEmail, address)) {
        return "{\"200\" : \"OK\"}";
      } else {
        return "{\"ERROR\" : \"AN ERROR\"}";
      }
    }
  }

  /**
   * class that sends email to owner if listing is unclaimed.
   */
  private static class EmailOwnerOnUnclaim implements Route {
    /**
     * takes in a JSON object, and sends an email to the appropriate address.
     * @param request - the JSON object with the listing info
     * @param response - the response
     * @return - whether or not the email was successfully sent
     * @throws Exception - if there's an error when processing
     */
    @Override
    public String handle(Request request, Response response) throws Exception {
      JSONObject reqJSON = new JSONObject(request.body());
      JSONObject dataToSend = reqJSON.getJSONObject("dataToSend");

      //retrieves the email addresses from the JSON
      String ownerEmail = dataToSend.getString("owner_email");
      String otherEmail = dataToSend.getString("user_email");

      //retrieves the address
      Iterator<String> iterator = dataToSend.keys();
      String address = "";
      while (iterator.hasNext()) {
        String listingName = iterator.next();
        address = dataToSend.getJSONObject(listingName).getString("address");
        break;
      }

      //sends the email
      if (EmailOwner.sendEmailToOwnerOnUnclaim(ownerEmail, otherEmail, address)) {
        return "{\"200\" : \"OK\"}";
      } else {
        return "{\"ERROR\" : \"AN ERROR\"}";
      }
    }
  }

  /**
   * class that sends email to user about acceptance or rejection.
   */
  private static class EmailUserOnDecision implements Route {
    /**
     * takes in a JSON object, and sends an email to the appropriate address.
     * @param request - the JSON object with the listing info
     * @param response - the response
     * @return - whether or not the email was successfully sent
     * @throws Exception - if there's an error when processing
     */
    @Override
    public String handle(Request request, Response response) throws Exception {
      JSONObject reqJSON = new JSONObject(request.body());
      JSONObject dataToSend = reqJSON.getJSONObject("dataToSend");

      //retrieves the email addresses from the JSON
      String userEmail = dataToSend.getString("user_email");
      String otherEmail = dataToSend.getString("owner_email");

      //retrieves the address
      String address = dataToSend.getJSONObject("key1").getString("address");

      //sends a different email based on whether it was accepted or rejected
      if (dataToSend.getStrin g("accepted").equals("true")) {
        if (EmailUser.sendEmailToUserAccepted(userEmail, otherEmail, address)) {
          return "{\"200\" : \"OK\"}";
        } else {
          return "{\"ERROR\" : \"AN ERROR\"}";
        }
      } else {
        if (EmailUser.sendEmailToUserRejected(userEmail, address)) {
          return "{\"200\" : \"OK\"}";
        } else {
          return "{\"ERROR\" : \"AN ERROR\"}";
        }
      }

    }
  }

}








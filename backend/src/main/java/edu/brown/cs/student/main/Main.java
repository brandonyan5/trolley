package edu.brown.cs.student.main;

import com.google.common.collect.ImmutableMap;
import com.google.gson.Gson;
import edu.brown.cs.student.main.listing.Listing;
import edu.brown.cs.student.main.sorter.Filter;
import joptsimple.OptionParser;
import joptsimple.OptionSet;
import netscape.javascript.JSObject;
import org.json.JSONObject;
import spark.Request;
import spark.Response;
import spark.Route;
import spark.Spark;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

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
    //sort after filtering
    private static class FilterAndSortProducts implements Route {
        @Override
        public String handle(Request request, Response response) throws Exception {
            JSONObject reqJSON = new JSONObject(request.body());

            JSONObject productJSON = reqJSON.getJSONObject("Products");
            Iterator<String> productIterator = productJSON.keys();

            JSONObject filterJSON = reqJSON.getJSONObject("Filters");
            Iterator<String> filterIterator = filterJSON.keys();
            String userAddress = "";
            List<Listing> listings = new ArrayList<>();

            while (filterIterator.hasNext()) {
                String eachKey = filterIterator.next();
                List<String> dates = (List<String>) filterJSON.getJSONArray("Dates");
                List<String> areaRange = (List<String>) filterJSON.getJSONArray("Area");
                List<String> priceRange = (List<String>) filterJSON.getJSONArray("Price");
                userAddress = filterJSON.getString("user_address");
                String distance = filterJSON.getString("Distance");
                Filter.dates = dates;


            }

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

                //then make ls object
                //then call ls.setDistance(user_address)
                //setDistance method is in listing class
                //then add to a list
                //then pass list into isValid - which returns a new list of listings with bad listings dropped
                //then pass that into sort(), which returns the sorted list of listings
                //then i convert that list of listings into a JSON, and return that at the end of this handler
                //continue here
            }

        }
    }

    private static class EmailOwnerOnClaim implements Route {
        @Override
        public String handle(Request request, Response response) throws Exception {
            JSONObject reqJSON = new JSONObject(request.body());

            JSONObject productJSON = reqJSON.getJSONObject("Products");
            Iterator<String> productIterator = productJSON.keys();

            JSONObject filterJSON = reqJSON.getJSONObject("Filters");
            Iterator<String> filterIterator = filterJSON.keys();
        }
    }

    private static class EmailUserOnDecision implements Route {
        @Override
        public String handle(Request request, Response response) throws Exception {
            JSONObject reqJSON = new JSONObject(request.body());
            String tableName = reqJSON.getString("table");
            JSONObject row = reqJSON.getJSONObject("row");
            Iterator<String> iterator = row.keys();
            Set<String> nameOfColumns = new HashSet<>();
            List<String> colValues = new ArrayList<>();
            while (iterator.hasNext()) {
                String eachKey = iterator.next();
                nameOfColumns.add(eachKey);
                colValues.add(row.getString(eachKey));
            }
            try {
                db.addRow(colValues, tableName);
            } catch (DatabaseNotLoadedException e) {
                return "ERROR: Database wasn't loaded";
            } catch (SQLException e) {
                return "ERROR: You are inserting incorrectly";
            } catch (IndexOutOfBoundsException e) {
                return "ERROR: You are adding incorrectly";
            }
            return "OK";
        }
    }

}






































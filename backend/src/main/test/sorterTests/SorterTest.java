package sorterTests;

import edu.brown.cs.student.main.listing.Listing;
import edu.brown.cs.student.main.sorter.Sorter;
import org.junit.Assert;
import org.junit.Test;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;

public class SorterTest {

  @Test
  public void sorterTest() {

    // https://stackoverflow.com/questions/11701399/round-up-to-2-decimal-places-in-java

    DecimalFormat f = new DecimalFormat("##.00");

    Listing l1 = new Listing("", 6.0, 11.0, 150.0,
            "1999-05-20", "2005-05-20", "", "", "Listing1");

    Listing l2 = new Listing("", 40.0, 89.0, 200.0,
            "1999-05-20", "2005-05-20", "", "", "Listing2");

    List<Listing> ls = new ArrayList<>();
    ls.add(l1);
    ls.add(l2);

    Sorter s = new Sorter();

    Double[] x = s.extremePrices(ls);
    double highestPrice = x[0];
    double lowestPrice = x[1];

    Double[] y = s.extremeAreas(ls);
    double highestArea = y[0];
    double lowestArea = y[1];

    Double[] z = s.extremeDistances(ls);
    double highestDistance = z[0];
    double lowestDistance = z[1];

    Assert.assertTrue(highestPrice == 89.0);
    Assert.assertTrue(lowestPrice == 11.0);

    Assert.assertTrue(highestArea == 200.0);
    Assert.assertTrue(lowestArea == 150.0);

    Assert.assertTrue(highestDistance == 40.0);
    Assert.assertTrue(lowestDistance == 6.0);

    double[] weights = new double[3];
    weights[0] = 0.5;
    weights[1] = 0.7;
    weights[2] = 0.9;
    s.normalizer(ls, weights);
    Assert.assertTrue(ls.get(0).getNormalizedNumeric().get(0) == 0.55);
    System.out.println("PRINT: " + ls.get(0).getNormalizedNumeric().get(1));
    Assert.assertTrue(ls.get(0).getNormalizedNumeric().get(1) == 0.675);
    Assert.assertTrue(ls.get(0).getNormalizedNumeric().get(2) == 0.84);

    s.euclideanDistanceSetter(ls);
    System.out.println("EUCLID: " + f.format(ls.get(0).geteuclideanDistance()));
    Assert.assertEquals("10.55", f.format(ls.get(0).geteuclideanDistance()));
    Assert.assertEquals("71.53", f.format(ls.get(1).geteuclideanDistance()));

    Listing l3 = new Listing("", 0.0, 0.0, 0.0,
            "1999-05-20", "2005-05-20", "", "", "Listing3");
    l3.seteuclideanDistance(1.0);
    ls.add(l3);

    List<Listing> finalList = s.sorter(ls);
    Assert.assertTrue(finalList.get(0).getListingName().equals("Listing3"));
    Assert.assertTrue(finalList.get(1).getListingName().equals("Listing1"));
    Assert.assertTrue(finalList.get(2).getListingName().equals("Listing2"));


  }
}
package edu.brown.cs.student.main.sorter;

import edu.brown.cs.student.main.listing.Listing;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class Sorter {

  public Double lowestPrice;
  public Double highestArea;

  /**
   * sorts the listing using the specified weights.
   * @param listingList - the listings to sort.
   * @param filterWeights - how much user cares about each category
   * @return - the sorted listings
   */
  public List<Listing> sortAll(List<Listing> listingList, double[] filterWeights) {
    this.normalizer(listingList, filterWeights);
    this.euclideanDistanceSetter(listingList);
    return this.sorter(listingList);
  }

  /**
   * normalizes the listings.
   * @param listingList - the listings to be normalized
   * @param filterWeights - the weights for how much user cares about categories
   */
  public void normalizer(List<Listing> listingList, double[] filterWeights) {
    double highestPrice = this.extremePrices(listingList)[0];
    double lowestPrice = this.extremePrices(listingList)[1];
    this.lowestPrice = lowestPrice;

    double highestArea = this.extremeAreas(listingList)[0];
    this.highestArea = highestArea;
    double lowestArea = this.extremeAreas(listingList)[1];

    double highestDistance = this.extremeDistances(listingList)[0];
    double lowestDistance = this.extremeDistances(listingList)[1];

    for (Listing ls: listingList) {
      List<Double> temp = new ArrayList<>();
      double newPrice = ls.getPrice() / 10;
      double newDistance = ls.getDistance() / 5;
      double newArea = ls.getArea()  / 200;

      // apply filter weights on normalized [0,1] values
      newPrice *= filterWeights[0];
      newDistance *= filterWeights[1];
      newArea *= filterWeights[2];
      temp.add(newPrice);
      temp.add(newArea);
      temp.add(newDistance);
      ls.setNormalizedNumeric(temp);
    }
  }

  /**
   * sets the euclidean distance for each listing.
   * @param listingList - the listings to be operated on
   */
  public void euclideanDistanceSetter(List<Listing> listingList) {
    for (Listing ls: listingList) {
      // comparing to lowestPrice (Not necessarily 0, but the scaled value from [0,1] is 0.
      double priceSquared = Math.pow((ls.getNormalizedNumeric().get(0) - 0) * 10, 2);
      // want larger area = smaller Euclidean dist
      double areaSquared = Math.pow((1 - ls.getNormalizedNumeric().get(1)) * 10, 2);
      double dSquared = Math.pow(ls.getNormalizedNumeric().get(2) * 10, 2);
      double euclidean = Math.sqrt(dSquared + priceSquared + areaSquared);
      ls.setEuclideanDistance(euclidean);
    }
  }

  /**
   * sorts the listings.
   * @param listingList - the listings to be sorted
   * @return - the sorted listings.
   */
  public List<Listing> sorter(List<Listing> listingList) {
    listingList.sort(Comparator.comparing(Listing::getEuclideanDistance));
    return listingList;
  }

  /**
   * computes the highest and lowest prices.
   * @param listingList - the listings to be operated on
   * @return - the highest and lowest prices.
   */
  public Double[] extremePrices(List<Listing> listingList) {
    Double[] result = new Double[2];
    result[0] = (0.0);
    result[1] = (Double.MAX_VALUE);
    for (Listing ls: listingList) {
      ls.setNumeric();
      double temp = ls.getNumeric().get(0);
      result[0] = Math.max(temp, result[0]);
      result[1] = Math.min(temp, result[1]);
    }
    return result;
  }

  /**
   * computes the highest and lowest areas.
   * @param listingList - the listings to be operated on
   * @return - the highest and lowest areas.
   */
  public Double[] extremeAreas(List<Listing> listingList) {
    Double[] result = new Double[2];
    result[0] = (0.0);
    result[1] = (Double.MAX_VALUE);
    for (Listing ls: listingList) {
      double temp = ls.getNumeric().get(1);
      result[0] = Math.max(temp, result[0]);
      result[1] = Math.min(temp, result[1]);
    }
    return result;
  }

  /**
   * computes the highest and lowest distances.
   * @param listingList - the listings to be operated on
   * @return - the highest and lowest distances.
   */
  public Double[] extremeDistances(List<Listing> listingList) {
    Double[] result = new Double[2];
    result[0] = (0.0);
    result[1] = (Double.MAX_VALUE);
    for (Listing ls: listingList) {
      double temp = ls.getNumeric().get(2);
      result[0] = Math.max(temp, result[0]);
      result[1] = Math.min(temp, result[1]);
    }
    return result;
  }
}
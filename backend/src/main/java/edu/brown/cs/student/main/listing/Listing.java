package edu.brown.cs.student.main.listing;

public class Listing {
    public String getAddress() {
        return address;
    }

    public Double getPrice() {
        return price;
    }

    public Double getArea() {
        return area;
    }

    public String getDate_start() {
        return date_start;
    }

    public String getDate_end() {
        return date_end;
    }

    public Double getDistance() {
        return distance;
    }

    private String address;
    private Double price;
    private Double area;
    private String date_start;
    private String date_end;
    private Double distance;
    private String ownerEmail;
    private String userEmail;
    private String listingName;

    public String getListingName() {
        return listingName;
    }

    public String getOwnerEmail() {
        return ownerEmail;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public Listing(String address, Double price, Double area, String date_start, String date_end, String ownerEmail, String userEmail, String listingName) {
        this.address = address;
        this.price = price;
        this.area = area;
        this.date_start = date_start;
        this.date_end = date_end;
        this.ownerEmail = ownerEmail;
        this.userEmail = userEmail;
        this.listingName = listingName;
    }
}

package edu.brown.cs.student.main.listing;

public class Listing {
    public String address;
    public Double price;
    public Double area;
    public String date_start;
    public String date_end;
    public Double distance;

    public Listing(String address, Double price, Double area, String date_start, String date_end) {
        this.address = address;
        this.price = price;
        this.area = area;
        this.date_start = date_start;
        this.date_end = date_end;
    }
}
